import { useState } from 'react'
import { getProfile, updateProfile } from '~/services/profileService.js'

export default function useProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async () => {
    setLoading(true)
    const data = await getProfile()
    setProfile(data)
    setLoading(false)
  }

  const updateUserProfile = async (newData) => {
    setLoading(true)
    const updated = await updateProfile(newData)
    if (updated) setProfile(updated)
    setLoading(false)
  }

  return { profile, loading, fetchProfile, updateUserProfile }
}
