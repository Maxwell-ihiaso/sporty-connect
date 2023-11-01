"use client"

import styles from './page.module.css'
import { Button, Stack, Typography } from '@mui/material'
import { theme } from '@/styles/theme'

export default function Home() {
  return (
    <main className={styles.main}>
  


      <Stack>
        <Button color="primary">Test</Button>
        <Typography sx={{
          color: theme.palette.primary.main
        }}>TETSING THING</Typography>
      </Stack>

    </main>
  )
}
