'use client'

import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/swagger')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setSpec(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load Swagger spec', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1>Cargando documentación API...</h1>
        <p>Esperando spec OpenAPI desde /api/swagger</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1>❌ Error al cargar Swagger spec</h1>
        <p>Error: {error}</p>
        <p>Verifica que /api/swagger esté disponible</p>
      </div>
    )
  }

  if (!spec) {
    return (
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1>⚠️ No spec disponible</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: '0' }}>
      <SwaggerUI spec={spec} />
    </div>
  )
}
