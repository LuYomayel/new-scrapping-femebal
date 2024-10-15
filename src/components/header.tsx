'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSub, MenubarSubTrigger, MenubarSubContent } from "@/components/ui/menubar"
import { Switch } from "@/components/ui/switch"
import { Menu } from 'lucide-react'

type Torneo = {
  year: number
  tipo: string
}

export function HeaderComponent() {
  const [torneos, setTorneos] = useState<Torneo[]>([])
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    getTorneos().then(setTorneos)
  }, [])

  const changeTheme = (checked: boolean) => {
    setChecked(checked)
    // Implement your theme switching logic here
    console.log('Theme switched:', checked)
  }

  const getTorneos = async (): Promise<Torneo[]> => {
    // Implement your API call here
    // For now, we'll return mock data
    return [
      { year: 2023, tipo: 'Apertura' },
      { year: 2023, tipo: 'Clausura' },
      { year: 2022, tipo: 'Apertura' },
    ]
  }

  return (
    <header className="w-full">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <Link href="/">Goleadores</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <Link href="/fairplay">Fairplay</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <Link href="/estadisticas">Estadisticas</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <Link href="/cafecito">Cafecito</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <div className="ml-auto flex items-center space-x-4">
          <Switch
            checked={checked}
            onCheckedChange={changeTheme}
            aria-label="Toggle theme"
          />
        </div>
      </Menubar>
    </header>
  )
}