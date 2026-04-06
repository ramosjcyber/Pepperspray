// pages/index.js — redirect root to catalog
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  useEffect(() => { router.replace('/catalog') }, [])
  return null
}
