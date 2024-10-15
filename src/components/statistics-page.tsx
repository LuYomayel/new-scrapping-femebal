'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Bar, Pie } from 'react-chartjs-2'
import moment from 'moment'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

type Torneo = {
  id: number
  year: number
  tipo: string
}

type ChartData = {
  labels: string[]
  datasets: any[]
}

const apiUrl = 'https://api-handball-metropolitano.luciano-yomayel.com'

export function StatisticsPageComponent() {
  const [loading, setLoading] = useState(false)
  const [torneos, setTorneos] = useState<Torneo[]>([])
  const [torneo, setTorneo] = useState<Torneo | null>(null)
  const [fechaActualizacion, setFechaActualizacion] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('null')
  const [selectedDivision, setSelectedDivision] = useState('null')
  const [selectedGender, setSelectedGender] = useState('null')
  const [selectedTeam, setSelectedTeam] = useState('null')
  const [selectedStatistic, setSelectedStatistic] = useState('null')
  const [showTeams, setShowTeams] = useState(true)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [mvpChartDataLow, setMvpChartDataLow] = useState<ChartData | null>(null)
  const [mvpChartDataHigh, setMvpChartDataHigh] = useState<ChartData | null>(null)
  const [tableData, setTableData] = useState<any[]>([])
  const [selectedTorneo, setSelectedTorneo] = useState<number>(-1)
  const [mensajeExplicativo, setMensajeExplicativo] = useState('Selecciona una estadística para obtener una breve explicación.')
  const [options, setOptions] = useState<any>(null)
  const [optionsMVP, setOptionsMVP] = useState<any>(null)
  const [equipoFiltrado, setEquipoFiltrado] = useState<any>(null)
  const [goleador, setGoleador] = useState<any>(null)
  const [arrayPartidosMVP, setArrayPartidosMVP] = useState<any[]>([])
  const [arrayPartidosVisitante, setArrayPartidosVisitante] = useState<any[]>([])
  const [arrayPartidos, setArrayPartidos] = useState<any[]>([])
  const [teams, setTeams] = useState<{ label: string; value: string }[]>([])

  const categories = [
    { label: 'Elegir Categoría...', value: 'null' },
    { label: 'Mayores', value: 'Mayores' },
    { label: 'Juniors', value: 'Junior' },
    { label: 'Juveniles', value: 'Juveniles' },
    { label: 'Cadetes', value: 'Cadetes' },
    { label: 'Menores', value: 'Menores' },
    { label: 'Infantiles', value: 'Infantiles' },
  ]

  const divisionsMayores = [
    { label: 'Elegir División...', value: 'null' },
    { label: 'LHC Oro', value: 'Liga de Honor Oro' },
    { label: 'LHC Plata', value: 'Liga de Honor Plata' },
    { label: 'Primera', value: '1°' },
    { label: 'Segunda', value: '2°' },
    { label: 'Tercera', value: '3°' },
  ]

  const divisionsInferiores = [
    { label: 'Elegir División...', value: 'null' },
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' },
    { label: 'D', value: 'D' },
    { label: 'E', value: 'E' },
  ]

  const genders = [
    { label: 'Elegir Rama...', value: 'null' },
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Femenino', value: 'Femenino' },
  ]

  const statistics = [
    { label: 'Elegir Estadística...', value: 'null' },
    { label: 'Impacto del medio tiempo', value: 'primerTiempo' },
    { label: 'Impacto del goleador', value: 'segunGoleador' },
    { label: '% vic. Visitante/Local', value: 'porcentajeVisitanteLocal' },
  ]

  useEffect(() => {
    getTorneos()
    fetchFechaActualizacion()
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

  const getTorneos = async () => {
    try {
      const res = await fetch(`${apiUrl}/torneo`) // Replace with your API endpoint
      const data = await res.json()
      console.log(data)
      setTorneos(data)
      setSelectedTorneo(data[0]?.id || -1)
      setTorneo(data[0] || null)
    } catch (error) {
      console.log(error)
    }
  }

  const getEquipos = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/equipo`) // Replace with your API endpoint
      const data = await res.json()
      const equipos = data.map((equipo: any) => ({
        label: equipo.nombre,
        value: equipo.id,
      }))
      setTeams(equipos)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleStatisticChange = (value: string) => {
    setSelectedStatistic(value)
    setShowTeams(value !== 'porcentajeVisitanteLocal')

    if (value === 'primerTiempo') {
      setMensajeExplicativo('Explora cómo el resultado al medio tiempo afecta el desenlace del partido.')
    } else if (value === 'segunGoleador') {
      setMensajeExplicativo('Analiza cómo la actuación de los máximos anotadores influye en el resultado final del partido.')
    } else if (value === 'porcentajeVisitanteLocal') {
      setMensajeExplicativo('La tabla muestra el porcentaje de partidos ganados como local y visitante.')
    } else {
      setMensajeExplicativo('Selecciona una estadística para obtener una breve explicación.')
    }
  }

  const validateFilters = () => {
    if (
      (selectedStatistic === 'porcentajeVisitanteLocal' &&
        (selectedCategory === 'null' ||
          selectedDivision === 'null' ||
          selectedGender === 'null')) ||
      (selectedStatistic !== 'porcentajeVisitanteLocal' &&
        (selectedTeam === 'null' ||
          selectedStatistic === 'null' ||
          selectedCategory === 'null' ||
          selectedDivision === 'null' ||
          selectedGender === 'null'))
    ) {
      alert('Debe completar todos los filtros')
      return false
    }
    return true
  }

  const cleanEverything = () => {
    setChartData(null)
    setMvpChartDataLow(null)
    setMvpChartDataHigh(null)
    setOptions(null)
    setOptionsMVP(null)
    setEquipoFiltrado(null)
    setGoleador(null)
    setArrayPartidosMVP([])
    setArrayPartidosVisitante([])
    setArrayPartidos([])
  }

  const generateChart = () => {
    cleanEverything()
    if (!validateFilters()) return

    setLoading(true)

    if (selectedStatistic === 'primerTiempo') {
      generateChartSegun1erTiempo()
    } else if (selectedStatistic === 'segunGoleador') {
      generateChartSegunMVP()
    } else if (selectedStatistic === 'porcentajeVisitanteLocal') {
      generateTablePorcentajeVisitanteLocal()
    } else {
      alert('Debe seleccionar una estadística')
      setLoading(false)
    }
  }

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#000'
        },
        grid: {
          color: '#ccc',
          drawBorder: false
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: '#000'
        },
        grid: {
          color: '#ccc',
          drawBorder: false
        }
      }
    }
  }

  const pieChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false
      },
      legend: {
        position: 'top' as const,
      },
    },
  }
  const generateChartSegun1erTiempo = async () => {
    setLoading(true)
    cleanEverything()
    try {

      const torneo = torneos.find(t => t.id === selectedTorneo)
      const response = await fetch(`${apiUrl}/partido/estadisticas/primer-tiempo/${selectedTeam}/${selectedCategory}/${selectedDivision}/${selectedGender}/${torneo?.tipo}/${torneo?.year}`, {
        method: 'GET',
        // Add necessary headers and params
      })
      const res = await response.json()
      console.log(res)
      setChartData(transformarDatosParaGraficoStacked(res.resultados))
      setArrayPartidos(res.arrayPartidos.sort((a: any, b: any) => {
        let fechaA = new Date(a.partido.fecha)
        let fechaB = new Date(b.partido.fecha)
        return fechaA.getTime() - fechaB.getTime()
      }))

      setOptions(chartOptions)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const generateChartSegunMVP = async () => {
    setLoading(true)
    cleanEverything()
    try {
      const equipoNombre = await getEquipoById(selectedTeam)
      setEquipoFiltrado(equipoNombre)

      const response = await fetch(`${apiUrl}/partido/estadisticas/analizarRendimientoConMVP/${selectedTeam}/${selectedCategory}/${selectedDivision}/${selectedGender}/${torneo?.tipo}/${torneo?.year}`, {
        method: 'GET',
        // Add necessary headers and params
      })
      const res = await response.json()
      console.log(res)

      setMvpChartDataLow(transformarDatosParaGraficoPie(res.bajoPromedio))
      setMvpChartDataHigh(transformarDatosParaGraficoPie(res.sobrePromedio))
      setGoleador(res.jugador)

      setArrayPartidosMVP(res.arrayPartidos.sort((a: any, b: any) => {
        let fechaA = new Date(a.fecha)
        let fechaB = new Date(b.fecha)
        return fechaA.getTime() - fechaB.getTime()
      }))
      setArrayPartidosMVP(prev => [
        {
          fecha: 'Resumen/Promedio',
          equipoRival: { nombre: '' },
          resultado: '',
          golesMVP: `${res.totalGoles} / ${res.promedioGolesMVP}`,
          porcentajeGolesMVP: res.porcentajeGolesMVP,
        },
        ...prev
      ])

      setOptionsMVP(pieChartOptions)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getEquipoById = async (idEquipo: string) => {
    try {
      const response = await fetch(`${apiUrl}/equipo/byId/${idEquipo}`, {
        method: 'GET',
        // Add necessary headers and params
      })
      const res = await response.json()
      return res.nombre
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const transformarDatosParaGraficoPie = (datosMVP: any): ChartData => {
    return {
      labels: ['Ganados', 'Perdidos', 'Empatados'],
      datasets: [
        {
          data: [
            parseFloat(datosMVP.porcentajeGanados),
            parseFloat(datosMVP.porcentajePerdidos),
            parseFloat(datosMVP.porcentajeEmpatados)
          ],
          backgroundColor: ['#4caf50', '#f44336', '#ffc107'],
          hoverBackgroundColor: ['#66bb6a', '#e57373', '#ffca28']
        }
      ]
    }
  }

  const transformarDatosParaGraficoStacked = (respuestaApi: any): ChartData => {
    return {
      labels: ['Ganar Primer Tiempo', 'Empatar Primer Tiempo', 'Perder Primer Tiempo'],
      datasets: [
        {
          type: 'bar',
          label: 'Y Ganar',
          backgroundColor: '#4caf50', // Green
          data: [
            respuestaApi.ganarPrimerTiempoYGanar,
            respuestaApi.empatarPrimerTiempoYGanar,
            respuestaApi.perderPrimerTiempoYGanar
          ]
        },
        {
          type: 'bar',
          label: 'Y Empatar',
          backgroundColor: '#ffc107', // Yellow
          data: [
            respuestaApi.ganarPrimerTiempoYEmpatar,
            respuestaApi.empatarPrimerTiempoYEmpatar,
            respuestaApi.perderPrimerTiempoYEmpatar
          ]
        },
        {
          type: 'bar',
          label: 'Y Perder',
          backgroundColor: '#f44336', // Red
          data: [
            respuestaApi.ganarPrimerTiempoYPerder,
            respuestaApi.empatarPrimerTiempoYPerder,
            respuestaApi.perderPrimerTiempoYPerder
          ]
        }
      ]
    }
  }

  const generateTablePorcentajeVisitanteLocal = async () => {
    setLoading(true)
    cleanEverything()
    try {
      const response = await fetch(`${apiUrl}/partido/estadisticas/visitanteLocal/${selectedCategory}/${selectedDivision}/${selectedGender}/${torneo?.tipo}/${torneo?.year}`, {
        method: 'GET',
        // Add necessary headers and params
      })
      const res = await response.json()
      console.log(res)
      setArrayPartidosVisitante(res)

      setOptions({
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            labels: {
              color: '#000'
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: '#000'
            },
            grid: {
              color: '#ccc',
              drawBorder: false
            }
          },
          y: {
            stacked: true,
            ticks: {
              color: '#000'
            },
            grid: {
              color: '#ccc',
              drawBorder: false
            }
          }
        }
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Determine divisions based on selected category
  const divisions = selectedCategory === 'Mayores' ? divisionsMayores : divisionsInferiores

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Estadísticas</CardTitle>
        {fechaActualizacion && (
          <p className="text-sm text-gray-500">Última actualización: {fechaActualizacion}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar división" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((div) => (
                  <SelectItem key={div.value} value={div.value}>
                    {div.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gen) => (
                  <SelectItem key={gen.value} value={gen.value}>
                    {gen.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showTeams && (
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.value} value={team.value}>
                      {team.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={selectedStatistic} onValueChange={handleStatisticChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar estadística" />
              </SelectTrigger>
              <SelectContent>
                {statistics.map((stat) => (
                  <SelectItem key={stat.value} value={stat.value}>
                    {stat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-gray-500">{mensajeExplicativo}</p>
          <Button onClick={generateChart} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generar Gráfico
          </Button>
        </div>
        {chartData && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Impacto del Medio Tiempo</h3>
            <div className="h-[400px]">
              <Bar data={chartData} options={options} />
            </div>
            {/* You can also render the arrayPartidos data if needed */}
          </div>
        )}
        {mvpChartDataLow && mvpChartDataHigh && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Rendimiento Bajo Promedio</h3>
              <div className="h-[400px]">
                <Pie data={mvpChartDataLow} options={optionsMVP} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Rendimiento Sobre Promedio</h3>
              <div className="h-[400px]">
                <Pie data={mvpChartDataHigh} options={optionsMVP} />

              </div>
            </div>
            {/* You can also render goleador and arrayPartidosMVP data if needed */}
          </div>
        )}
        {arrayPartidosVisitante.length > 0 && (

            <div className="mt-8  h-[400px] overflow-auto">
              <h3 className="text-lg font-semibold mb-4">Porcentaje de Victorias Local/Visitante</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Victorias Local</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Victorias Visitante</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {arrayPartidosVisitante.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{row.equipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.localGanados}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.visitanteGanados}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </CardContent>
    </Card>
  )
}