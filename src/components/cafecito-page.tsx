"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coffee, Heart, Linkedin } from "lucide-react"

export function CafecitoPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-amber-800">Cafecito</CardTitle>
            <CardDescription className="text-xl text-amber-700">
              Apoya el mantenimiento de este sitio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-amber-900"
            >
              Este sitio web es fruto de mi amor por el handball y los números. Todo el trabajo realizado aquí es por iniciativa propia y sin fines de lucro.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-amber-900"
            >
              Mantener este sitio activo conlleva ciertos costos, especialmente en lo referente al servidor. Si te gusta lo que hago y deseas contribuir a mantener viva esta iniciativa, tu apoyo a través de un "cafecito" será enormemente valorado.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-amber-900"
            >
              Cada contribución ayuda a cubrir los gastos del servidor y a asegurar que este espacio siga siendo un punto de encuentro para los apasionados del handball.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col items-center space-y-4"
            >
              <h4 className="text-xl font-semibold text-amber-800">¡Gracias por tu apoyo!</h4>
              <a
                href="https://cafecito.app/luyomayel"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="https://cdn.cafecito.app/imgs/buttons/button_4.png"
                  srcSet="https://cdn.cafecito.app/imgs/buttons/button_4.png 1x, https://cdn.cafecito.app/imgs/buttons/button_4_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_4_3.75x.png 3.75x"
                  alt="Invitame un café en cafecito.app"
                  className="h-12"
                />
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-col items-center space-y-4"
            >
              <p className="text-center text-amber-900">
                Si quieres que te ayude con algún proyecto, puedes contactarme por
              </p>
              <Button
                variant="outline"
                size="lg"
                className="bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all duration-300"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/luciano-yomayel/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}