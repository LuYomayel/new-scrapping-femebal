// src/components/player-profile.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

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

type PlayerProfileProps = {
  player: Player;
  onBack: () => void;
  torneo: Torneo | undefined;
};

type Estadistica = {
  fecha: number;
  torneo: string;
  goles: number;
  equipoRival: string;
  // otros campos si es necesario
};

const apiUrl = 'https://api-handball-metropolitano.luciano-yomayel.com'
export function PlayerProfile({ player, onBack, torneo }: PlayerProfileProps) {
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEstadisticas(player._id);
  }, [player]);

  const getEstadisticas = async (playerId: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/jugador/estadisticasJugador/${playerId}?tipo=${torneo?.tipo}&year=${torneo?.year}`
      ); 
      const data = await res.json();
      const estadisticasOrdenadas = data.estadisticasPorFecha.sort(
        (a: any, b: any) => a.fecha - b.fecha
      );
      console.log('estadisticasOrdenadas', estadisticasOrdenadas)
      setEstadisticas(estadisticasOrdenadas);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={onBack}>Volver</Button>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mt-4">Estadísticas de {player.nombre}</h2>
          <div className="h-[400px] overflow-auto">
            <Table >
                <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Torneo</TableHead>
                    <TableHead>Equipo Contrario</TableHead>
                    <TableHead>Goles</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody className="h-[400px] overflow-auto">
                {estadisticas.map((estadistica, index) => (
                    <TableRow key={index}>
                    <TableCell>{estadistica.fecha}</TableCell>
                    <TableCell>{estadistica.torneo}</TableCell>
                    <TableCell>{estadistica.equipoRival}</TableCell>
                    <TableCell>{estadistica.goles}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}