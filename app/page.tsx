'use client'

import { useState } from 'react'
import styles from './page.module.css'

type BlockType = 'grass' | 'dirt' | 'stone' | 'wood' | 'diamond' | 'gold' | 'iron' | 'coal' | 'water' | 'lava' | 'sand' | 'glass'

interface Block {
  id: string
  type: BlockType
  x: number
  y: number
}

const blockColors: Record<BlockType, { primary: string; secondary: string }> = {
  grass: { primary: '#7CBD6B', secondary: '#8B7355' },
  dirt: { primary: '#8B7355', secondary: '#6B5B47' },
  stone: { primary: '#7F7F7F', secondary: '#4A4A4A' },
  wood: { primary: '#8B6F47', secondary: '#6B5527' },
  diamond: { primary: '#5DADE2', secondary: '#2E86AB' },
  gold: { primary: '#FFD700', secondary: '#DAA520' },
  iron: { primary: '#C0C0C0', secondary: '#808080' },
  coal: { primary: '#2C2C2C', secondary: '#1A1A1A' },
  water: { primary: '#3A8FD9', secondary: '#2E7BC4' },
  lava: { primary: '#FF6B35', secondary: '#D64521' },
  sand: { primary: '#E4D96F', secondary: '#C9C157' },
  glass: { primary: '#E8F4F8', secondary: '#C5E1EA' },
}

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass')
  const [inventory, setInventory] = useState<Record<BlockType, number>>({
    grass: 64,
    dirt: 64,
    stone: 64,
    wood: 64,
    diamond: 10,
    gold: 20,
    iron: 30,
    coal: 40,
    water: 8,
    lava: 4,
    sand: 64,
    glass: 32,
  })

  const blockTypes: BlockType[] = ['grass', 'dirt', 'stone', 'wood', 'diamond', 'gold', 'iron', 'coal', 'water', 'lava', 'sand', 'glass']

  const placeBlock = (x: number, y: number) => {
    if (inventory[selectedBlock] <= 0) return

    const existingBlock = blocks.find(b => b.x === x && b.y === y)
    if (existingBlock) return

    const newBlock: Block = {
      id: `${Date.now()}-${Math.random()}`,
      type: selectedBlock,
      x,
      y,
    }

    setBlocks([...blocks, newBlock])
    setInventory(prev => ({ ...prev, [selectedBlock]: prev[selectedBlock] - 1 }))
  }

  const removeBlock = (blockId: string, blockType: BlockType) => {
    setBlocks(blocks.filter(b => b.id !== blockId))
    setInventory(prev => ({ ...prev, [blockType]: prev[blockType] + 1 }))
  }

  const clearAll = () => {
    setBlocks([])
    setInventory({
      grass: 64,
      dirt: 64,
      stone: 64,
      wood: 64,
      diamond: 10,
      gold: 20,
      iron: 30,
      coal: 40,
      water: 8,
      lava: 4,
      sand: 64,
      glass: 32,
    })
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>⛏️ Minecraft Block Builder</h1>
        <button onClick={clearAll} className={styles.clearButton}>
          Clear All
        </button>
      </div>

      <div className={styles.inventory}>
        <h2 className={styles.inventoryTitle}>Inventory</h2>
        <div className={styles.inventoryGrid}>
          {blockTypes.map(type => (
            <div
              key={type}
              className={`${styles.inventorySlot} ${selectedBlock === type ? styles.selected : ''}`}
              onClick={() => setSelectedBlock(type)}
              style={{
                background: `linear-gradient(135deg, ${blockColors[type].primary} 0%, ${blockColors[type].secondary} 100%)`,
              }}
            >
              <span className={styles.count}>{inventory[type]}</span>
              <span className={styles.blockName}>{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.buildArea}>
        <div className={styles.grid}>
          {Array.from({ length: 10 }).map((_, row) => (
            <div key={row} className={styles.gridRow}>
              {Array.from({ length: 16 }).map((_, col) => {
                const block = blocks.find(b => b.x === col && b.y === row)
                return (
                  <div
                    key={`${row}-${col}`}
                    className={styles.gridCell}
                    onClick={() => block ? removeBlock(block.id, block.type) : placeBlock(col, row)}
                  >
                    {block && (
                      <div
                        className={styles.block}
                        style={{
                          background: `linear-gradient(135deg, ${blockColors[block.type].primary} 0%, ${blockColors[block.type].secondary} 100%)`,
                        }}
                      >
                        <div className={styles.blockHighlight}></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.instructions}>
        <p>🖱️ Click to place blocks | Right-click to remove | Select blocks from inventory</p>
      </div>
    </main>
  )
}
