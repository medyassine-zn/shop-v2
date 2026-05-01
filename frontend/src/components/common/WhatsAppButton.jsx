import { MessageCircle } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function WhatsAppButton() {
  const { settings } = useSettings()

  if (!settings.whatsappNumber) return null

  const number = settings.whatsappNumber.replace(/\D/g, '')
  const message = encodeURIComponent(`Bonjour ${settings.storeName} ! J'ai une question.`)

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="w-7 h-7 fill-white" />
    </a>
  )
}
