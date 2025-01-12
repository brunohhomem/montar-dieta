// seed.ts
import { PrismaClient } from '@prisma/client'
import * as xlsx from 'xlsx'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  // Carregar o arquivo Excel
  const filePath = path.resolve(__dirname, 'alimentos.xlsx')
  const workbook = xlsx.readFile(filePath)
  const sheetName = 'Plan1'
  const data: Record<string, any>[] = xlsx.utils.sheet_to_json(
    workbook.Sheets[sheetName]
  )

  for (const item of data) {
    const desc: string = item['Descrição dos alimentos']
    const energia: number = parseFloat(item['Energia (kcal)']) || 0
    const carboidrato: number = parseFloat(item['Carboidrato (g)']) || 0
    const proteina: number = parseFloat(item['Proteina (g)']) || 0
    const lipideos: number = parseFloat(item['Lipídeos(g)']) || 0
    const colesterolRaw = item['Colesterol (mg)']
    const tipo: string = item['Tipo']

    // Determinar valor booleano para colesterol
    const colesterol: boolean =
      typeof colesterolRaw === 'number' ? colesterolRaw > 0 : false

    // Inserir no banco de dados
    await prisma.alimento.create({
      data: {
        desc,
        energia,
        carboidrato,
        proteina,
        lipideos,
        colesterol,
        tipo
      }
    })
  }

  console.log('Seed concluído com sucesso!')
}

main()
  .catch(e => {
    console.error('Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
