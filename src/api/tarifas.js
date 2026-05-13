import axiosClient from './axiosClient'

const BASE_URL = '/tarifas'

export const tarifasApi = {
  async list(atraccionId = null) {
    const params = atraccionId ? { atraccionId } : {}
    const { data } = await axiosClient.get(BASE_URL, { params })
    return data
  },
}
