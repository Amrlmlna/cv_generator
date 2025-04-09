"use client"

import { useState } from "react"

export function useActionState(action) {
  const [state, setState] = useState(null)
  const [isPending, setIsPending] = useState(false)

  const actionWithState = async (formData) => {
    setIsPending(true)
    try {
      const result = await action(formData)
      setState(result)
      return result
    } catch (error) {
      console.error("Action error:", error)
      throw error
    } finally {
      setIsPending(false)
    }
  }

  return [state, actionWithState, isPending]
}

