"use client"

import { useState, useEffect } from "react"
import moment from "moment"
import html2canvas from "html2canvas"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Download, Loader2 } from "lucide-react"
import { PlayerProfile } from "./player-profile"
// Import your toast component if you have one
// import { toast } from "@/components/ui/use-toast"

type Player = {
  _id: string
  goles: number
  posicion: number
  nombre: string
  equipo: string
  categoria: string
  division: string
  cantPartidos: number
  promedioGoles: string
}

type Torneo = {
  id: number
  year: number
  tipo: string
}

const apiUrl = 'https://api-handball-metropolitano.luciano-yomayel.com'

export function TopScorersTableComponent() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [categories] = useState([
    { label: "Elegir Categoría...", value: "null" },
    { label: "Mayores", value: "Mayores" },
    { label: "Juniors", value: "Junior" },
    { label: "Juveniles", value: "Juveniles" },
    { label: "Cadetes", value: "Cadetes" },
    { label: "Menores", value: "Menores" },
    { label: "Infantiles", value: "Infantiles" },
  ])
  const [divisionsMayores] = useState([
    { label: "Elegir División...", value: "null" },
    { label: "LHC Oro", value: "Liga de Honor Oro" },
    { label: "LHC Plata", value: "Liga de Honor Plata" },
    { label: "Primera", value: "1°" },
    { label: "Segunda", value: "2°" },
    { label: "Tercera", value: "3°" },
  ])
  const [divisionsInferiores] = useState([
    { label: "Elegir División...", value: "null" },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "E", value: "E" },
  ])
  const [genders] = useState([
    { label: "Elegir Rama...", value: "null" },
    { label: "Masculino", value: "Masculino" },
    { label: "Femenino", value: "Femenino" },
  ])
  const [filterTypes] = useState([
    { label: "Categoría", value: "categoria" },
    { label: "Equipo", value: "equipo" },
    { label: "Jugador", value: "jugador" },
  ])
  const [teams, setTeams] = useState<{ label: string; value: string }[]>([])
  const [selectedFiltro, setSelectedFiltro] = useState("categoria")
  const [buscarJugador, setBuscarJugador] = useState("")
  const [selectedDivision, setSelectedDivision] = useState("null")
  const [selectedCategoria, setSelectedCategoria] = useState("null")
  const [selectedGenero, setSelectedGenero] = useState("null")
  const [selectedEquipo, setSelectedEquipo] = useState("null")
  const [fechaActualizacion, setFechaActualizacion] = useState("")
  const [torneos, setTorneos] = useState<Torneo[]>([])
  const [selectedTorneo, setSelectedTorneo] = useState<number>(-1)
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetchFechaActualizacion()
    getTorneos()
    getTable()
    getEquipos()
  }, [])

  useEffect(() => {
    // Clear players when filter changes
    setPlayers([])
    setCurrentPage(1)
  }, [selectedFiltro])

  const fetchFechaActualizacion = async () => {
    try {
      const res = await fetch(`${apiUrl}/visitas/ultimaActualizacion`)
      const data = await res.json()
      const date = new Date(data.ultima_actualizacion)
      setFechaActualizacion(
        moment(date).format("DD/MM/YYYY - HH:mm:ss")
      )
    } catch (error) {
      console.log(error)
    }
  }

  const getTable = async () => {
    setLoading(true)
    try {
      const categoria = 'Mayores'
      const division = 'Liga de Honor Oro'
      const genero = 'Femenino'
      const torneo = torneos.find(t => selectedTorneo === t.id)
      const res = await fetch(
        `${apiUrl}/jugador/categoria/${division}/${categoria}/${genero}?tipo=${torneo?.tipo}&year=${torneo?.year}`
      )
      const data = await res.json()
      const goleadores = data.goleadores.map(
        (goleador: any, index: number) => ({
          _id: goleador.jugador_id,
          goles: goleador.goles,
          posicion: index + 1,
          nombre: goleador.jugador_nombre,
          equipo: goleador.equipo_nombre,
          categoria: goleador.jugador_categoria,
          division: goleador.jugador_division,
          cantPartidos: goleador.partidosJugados,
          promedioGoles: (
            goleador.goles / goleador.partidosJugados
          ).toFixed(2),
        })
      )
      setPlayers(goleadores)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getEquipos = async () => {
    try {
      const res = await fetch(`${apiUrl}/equipo`)
      const data = await res.json()
      const equipos = data.map((equipo: any) => ({
        label: equipo.nombre,
        value: equipo.id,
      }))
      setTeams(equipos)
    } catch (error) {
      console.log(error)
    }
  }

  const getTorneos = async () => {
    try {
      const res = await fetch(`${apiUrl}/torneo`)
      const data = await res.json()
      setTorneos(data)
      setSelectedTorneo(data[0]?.id || -1)
      const newArray = [{ id: -1, year: 0, tipo: "" }, ...data] // Add default option
      setTorneos(newArray)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilter = () => {
    if (selectedFiltro === "categoria") {
      filtrarPorCategoria()
    } else if (selectedFiltro === "equipo") {
      filtrarPorEquipo()
    } else if (selectedFiltro === "jugador") {
      if (buscarJugador === "") {
        alert("Debe ingresar un nombre de jugador")
        return
      }
      filtrarPorJugador()
    }
    setCurrentPage(1) // Reset to first page after filtering
  }

  const filtrarPorCategoria = async () => {
    setLoading(true)
    try {
      const torneo = torneos.find(t => selectedTorneo === t.id)
      const res = await fetch(
        `${apiUrl}/jugador/categoria/${selectedDivision}/${selectedCategoria}/${selectedGenero}?tipo=${torneo?.tipo}&year=${torneo?.year}`
      )

      const data = await res.json()
      const goleadores = data.goleadores.map(
        (goleador: any, index: number) => ({
          _id: goleador.jugador_id,
          goles: goleador.goles,
          posicion: index + 1,
          nombre: goleador.jugador_nombre,
          equipo: goleador.equipo_nombre,
          categoria: goleador.jugador_categoria,
          division: goleador.jugador_division,
          cantPartidos: goleador.partidosJugados,
          promedioGoles: (
            goleador.goles / goleador.partidosJugados
          ).toFixed(2),
        })
      )
      setPlayers(goleadores)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const filtrarPorEquipo = async () => {
    setLoading(true)
    try {
      const torneo = torneos.find(t => selectedTorneo === t.id)
      const res = await fetch(
        `${apiUrl}/jugador/equipo/${selectedEquipo}/${selectedDivision}/${selectedCategoria}/${selectedGenero}?tipo=${torneo?.tipo}&year=${torneo?.year}`
      )
      const data = await res.json()
      const goleadores = data.goleadores.map(
        (goleador: any, index: number) => ({
          _id: goleador.jugador_id,
          goles: goleador.goles,
          posicion: index + 1,
          nombre: goleador.nombre,
          equipo: goleador.equipo,
          categoria: goleador.jugador_categoria,
          division: goleador.jugador_division,
          cantPartidos: goleador.partidosJugados,
          promedioGoles: (
            goleador.goles / goleador.partidosJugados
          ).toFixed(2),
        })
      )
      setPlayers(goleadores)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const filtrarPorJugador = async () => {
    setLoading(true)
    try {
      const torneo = torneos.find(t => selectedTorneo === t.id)
      const res = await fetch(
        `${apiUrl}/jugador/nombre/${buscarJugador}?tipo=${torneo?.tipo}&year=${torneo?.year}`
      )
      const data = await res.json()
      const goleadores = data.goleadores.map(
        (goleador: any, index: number) => ({
          _id: goleador.jugador_id,
          goles: goleador.goles,
          posicion: index + 1,
          nombre: goleador.jugador_nombre,
          equipo: goleador.equipo_nombre,
          categoria: goleador.jugador_categoria,
          division: goleador.jugador_division,
          cantPartidos: goleador.partidosJugados,
          promedioGoles: (
            goleador.goles / goleador.partidosJugados
          ).toFixed(2),
        })
      )
      setPlayers(goleadores)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const element = document.getElementById("table")
    if (!element) return
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      const titulo = `${
        selectedCategoria === "null" ? "Mayores" : selectedCategoria
      }_${
        selectedDivision === "null" ? "Liga de Honor Oro" : selectedDivision
      }_${selectedGenero === "null" ? "Masculino" : selectedGenero}`
      link.download = `${titulo}.png`
      link.click()
    })
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPlayers = players.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(players.length / itemsPerPage)

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, totalPages)
    )
  }

  // Determine divisions based on selected category
  const divisions =
    selectedCategoria === "Mayores"
      ? divisionsMayores
      : divisionsInferiores

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Tabla de Goleadores
          <small className="block text-sm text-gray-600">
          Si algunos filtros no se completan, los resultados pueden combinar datos de diferentes categorías, incluyendo goleadores históricos o el máximo goleador de toda Femebal, entre otros.
          </small>
        </CardTitle>
        
        {fechaActualizacion && (
          <p>Última actualización: {fechaActualizacion}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Select
              value={selectedFiltro}
              onValueChange={setSelectedFiltro}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar filtro" />
              </SelectTrigger>
              <SelectContent>
                {filterTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFiltro === "categoria" && (
              <>
                <Select
                  value={selectedCategoria}
                  onValueChange={setSelectedCategoria}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.value}
                        value={cat.value}
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDivision}
                  onValueChange={setSelectedDivision}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar división" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((div) => (
                      <SelectItem
                        key={div.value}
                        value={div.value}
                      >
                        {div.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedGenero}
                  onValueChange={setSelectedGenero}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gen) => (
                      <SelectItem
                        key={gen.value}
                        value={gen.value}
                      >
                        {gen.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedTorneo.toString()}
                  onValueChange={(value) =>
                    setSelectedTorneo(Number(value))
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar torneo" />
                  </SelectTrigger>
                  <SelectContent>
                    {torneos.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.year !== 0 ? `${cat.tipo} ${cat.year}` : "Histórico"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {selectedFiltro === "equipo" && (
              <>
                <Select
                  value={selectedCategoria}
                  onValueChange={setSelectedCategoria}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.value}
                        value={cat.value}
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedDivision}
                  onValueChange={setSelectedDivision}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar división" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((div) => (
                      <SelectItem
                        key={div.value}
                        value={div.value}
                      >
                        {div.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedGenero}
                  onValueChange={setSelectedGenero}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map((gen) => (
                      <SelectItem
                        key={gen.value}
                        value={gen.value}
                      >
                        {gen.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedEquipo}
                  onValueChange={setSelectedEquipo}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem
                        key={team.value}
                        value={team.value}
                      >
                        {team.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedTorneo.toString()}
                  onValueChange={(value) =>
                    setSelectedTorneo(Number(value))
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar torneo" />
                  </SelectTrigger>
                  <SelectContent>
                    {torneos.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.year !== 0 ? `${cat.tipo} ${cat.year}` : "Histórico"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {selectedFiltro === "jugador" && (
              <>
                <Input
                  type="text"
                  placeholder="Buscar jugador"
                  value={buscarJugador}
                  onChange={(e) =>
                    setBuscarJugador(e.target.value)
                  }
                  className="w-[200px]"
                />
                <Select
                  value={selectedTorneo.toString()}
                  onValueChange={(value) =>
                    setSelectedTorneo(Number(value))
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Seleccionar torneo" />
                  </SelectTrigger>
                  <SelectContent>
                    {torneos.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.year !== 0 ? `${cat.tipo} ${cat.year}` : "Histórico"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
          <div className="flex justify-between">
            <Button onClick={handleFilter}>Filtrar</Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Descargar Tabla
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          
          <>
            {selectedPlayer ? (
              // Aquí renderizas el componente del perfil del jugador
              <PlayerProfile
                player={selectedPlayer}
                onBack={() => setSelectedPlayer(null)}
                torneo={torneos.find(t => selectedTorneo === t.id)}
              />
            ) : (
              <>
            <Table id="table">
              <TableHeader>
                <TableRow>
                  <TableHead>Posición</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>División</TableHead>
                  <TableHead>Goles</TableHead>
                  <TableHead>Partidos</TableHead>
                  <TableHead>Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPlayers.map((player) => (
                  <TableRow key={player._id} onClick={() => setSelectedPlayer(player)}>
                    <TableCell>{player.posicion}</TableCell>
                    <TableCell>{player.nombre}</TableCell>
                    <TableCell>{player.equipo}</TableCell>
                    <TableCell>{player.categoria}</TableCell>
                    <TableCell>{player.division}</TableCell>
                    <TableCell>{player.goles}</TableCell>
                    <TableCell>{player.cantPartidos}</TableCell>
                    <TableCell>{player.promedioGoles}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              <div className="flex justify-center mt-4">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="mx-2"
              >
                Anterior
              </Button>
              <span className="self-center">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="mx-2"
              >
                Siguiente
              </Button>
            </div>
            </>
            )}
            
          </>
        )}
      </CardContent>
    </Card>
  )
}