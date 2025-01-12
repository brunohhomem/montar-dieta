import { prisma } from '../lib/prisma'

export default async function Home() {
  const alimentos = await prisma.alimento.findMany()

  return (
    <div>
      <h1>Lista de Alimentos</h1>
      <ul>
        {alimentos.map(alimento => (
          <li key={alimento.id}>
            <strong>{alimento.desc}</strong>: {alimento.energia} kcal
          </li>
        ))}
      </ul>
    </div>
  )
}
