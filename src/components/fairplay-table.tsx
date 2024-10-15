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
// Import your toast component if you have one
// import { toast } from "@/components/ui/use-toast"

type EquipoFairPlay = {
  equipoId: string
  equipoNombre: string
  puntajeTotal: number
  division: string
  genero: string
  categoria: string
  amarillas: number
  rojas: number
  azules: number
  dosmin: number
}

type JugadorFairPlay = {
  jugadorId: string
  jugadorNombre: string
  equipoId: string
  equipoNombre: string
  amarillas: number
  rojas: number
  azules: number
  dosmin: number
  puntajeTotal: number
  division: string
  genero: string
  categoria: string
}

type Torneo = {
  id: number
  year: number
  tipo: string
}

const apiUrl = 'https://api-handball-metropolitano.luciano-yomayel.com'

export function FairPlayComponent() {
  const [equiposFairPlay, setEquiposFairPlay] = useState<(EquipoFairPlay | JugadorFairPlay)[]>([])
  const [guardarTabla, setGuardarTabla] = useState<EquipoFairPlay[]>([])
  const [filtroJugador, setFiltroJugador] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fechaActualizacion, setFechaActualizacion] = useState("")

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

  // const [filterTypes] = useState([
  //   { label: "Categoría", value: "categoria" },
  //   { label: "Equipo", value: "equipo" },
  //   { label: "Jugador", value: "jugador" },
  // ])

  const [teams, setTeams] = useState<{ label: string; value: string }[]>([])
  const [selectedFiltro, setSelectedFiltro] = useState("categoria")
  const [buscarJugador, setBuscarJugador] = useState("")
  const [selectedDivision, setSelectedDivision] = useState("null")
  const [selectedCategoria, setSelectedCategoria] = useState("null")
  const [selectedGenero, setSelectedGenero] = useState("null")
  const [selectedEquipo, setSelectedEquipo] = useState("null")
  const [torneos, setTorneos] = useState<Torneo[]>([])
  const [selectedTorneo, setSelectedTorneo] = useState<number>(-1)
  const [torneo, setTorneo] = useState<Torneo | null>(null)

  const [equipoNombre, setEquipoNombre] = useState('')
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<JugadorFairPlay | null>(null)

  useEffect(() => {
    fetchFechaActualizacion()
    getTorneos()
    getTable()
    getEquipos()
  }, [])

  useEffect(() => {
    if (selectedTorneo !== -1) {
      const foundTorneo = torneos.find(t => t.id === selectedTorneo)
      if (foundTorneo) {
        setTorneo(foundTorneo)
      }
    }
  }, [selectedTorneo, torneos])

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

  const getTorneos = async () => {
    try {
      const res = await fetch(`${apiUrl}/torneo`)
      const data = await res.json()
      console.log(data)
      setTorneos(data)
      setSelectedTorneo(data[0]?.id || -1)
      setTorneo(data[0] || null)
    } catch (error) {
      console.log(error)
    }
  }

  const getTable = async () => {
    setLoading(true)
    try {
        console.log(torneo)
      if (!torneo) return
      const categoria = 'Mayores';
      const division = 'Liga de Honor Oro';
      const genero = 'Femenino';
      console.log(torneo)
      const res = await fetch(`${apiUrl}/jugador/fairplay/${division}/${categoria}/${genero}?tipo=${torneo.tipo}&year=${torneo.year}`)
      console.log(res)
      const data = await res.json()
      setEquiposFairPlay(data)
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
        value: equipo._id,
      }))
      setTeams(equipos)
    } catch (error) {
      console.log(error)
    }
  }

  const filtrarPorCategoria = async () => {
    setLoading(true)
    try {
      if (!torneo) return
      const res = await fetch(
        `${apiUrl}/jugador/fairplay/${selectedDivision}/${selectedCategoria}/${selectedGenero}?tipo=${torneo.tipo}&year=${torneo.year}`
      )
      const data = await res.json()
      setEquiposFairPlay(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    if (selectedFiltro === "categoria") {
      if (selectedCategoria === "null" || selectedDivision === "null" || selectedGenero === "null") {
        alert("Debe completar todos los filtros")
        return
      }
      filtrarPorCategoria()
    }
    // Implement other filters if needed
  }

  const onRowSelect = async (item: EquipoFairPlay | JugadorFairPlay) => {
    setLoading(true)
    if (!filtroJugador && 'equipoId' in item) {
      // User selected a team
      setEquipoNombre(item.equipoNombre)
      try {
        if (!torneo) return
        const res = await fetch(
          `${apiUrl}/jugador/fairPlayXClub/${item.equipoId}/${item.division}/${item.categoria}/${item.genero}?tipo=${torneo.tipo}&year=${torneo.year}`
        )
        const data = await res.json()
        setGuardarTabla(equiposFairPlay as EquipoFairPlay[])
        setEquiposFairPlay(data) // data is array of players
        setFiltroJugador(true)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    } else {
      // User selected a player
      setJugadorSeleccionado(item as JugadorFairPlay)
      setLoading(false)
    }
  }

  const goBack = () => {
    setFiltroJugador(false)
    setEquiposFairPlay(guardarTabla)
  }

  const handleDownload = () => {
    const element = document.getElementById("table")
    if (!element) return
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      const titulo = `FairPlay_${torneo?.tipo}_${torneo?.year}`
      link.download = `${titulo}.png`
      link.click()
    })
  }

  // Determine divisions based on selected category
  const divisions =
    selectedCategoria === "Mayores"
      ? divisionsMayores
      : divisionsInferiores

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Tabla de Fair Play</CardTitle>
        {fechaActualizacion && (
          <p>Última actualización: {fechaActualizacion}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            {/* <Select
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
            </Select> */}
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
                    {torneos.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.tipo} {t.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {/* Implement other filters if needed */}
          </div>
          <div className="flex justify-between">
            <Button onClick={handleFilter}>Filtrar</Button>
            {filtroJugador && (
              <Button onClick={goBack} variant="outline">
                Volver
              </Button>
            )}
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
          <Table id="table">
            <TableHeader>
              <TableRow>
                {/* Conditionally render table headers */}
                {!filtroJugador ? (
                  <>
                    <TableHead>Equipo</TableHead>
                    <TableHead>División</TableHead>
                    <TableHead>Género</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Amarillas</TableHead>
                    <TableHead>2 Min</TableHead>
                    <TableHead>Rojas</TableHead>
                    <TableHead>Azules</TableHead>
                    <TableHead>Puntos Fair Play</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Jugador</TableHead>
                    <TableHead>Amarillas</TableHead>
                    <TableHead>2 Min</TableHead>
                    <TableHead>Rojas</TableHead>
                    <TableHead>Azules</TableHead>
                    <TableHead>Puntos Fair Play</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {equiposFairPlay.map((item, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowSelect(item)}
                  className="cursor-pointer"
                >
                  {!filtroJugador ? (
                    <>
                      <TableCell>{(item as EquipoFairPlay).equipoNombre}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).division}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).genero}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).categoria}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).amarillas}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).dosmin}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).rojas}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).azules}</TableCell>
                      <TableCell>{(item as EquipoFairPlay).puntajeTotal}</TableCell>
                      
                    </>
                  ) : (
                    <>
                      <TableCell>{(item as JugadorFairPlay).jugadorNombre}</TableCell>
                      <TableCell>{(item as JugadorFairPlay).amarillas}</TableCell>
                      <TableCell>{(item as JugadorFairPlay).dosmin}</TableCell>
                      <TableCell>{(item as JugadorFairPlay).rojas}</TableCell>
                      <TableCell>{(item as JugadorFairPlay).azules}</TableCell>
                      <TableCell>{(item as JugadorFairPlay).puntajeTotal}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}