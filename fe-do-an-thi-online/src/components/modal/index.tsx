import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
export type ModalButton = {
  text: string
  onClick: () => void
  className?: string
}

export type ModalType = 'generate' | 'success'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  buttons?: ModalButton[]
  title?: string
  type?: ModalType
  exams:any,
  // success
  description?: string
}

export const Modal = ({
  isOpen,
  onClose,
  exams,
  children,
  title,
  description,
  buttons,
}: ModalProps) => {
  if (!isOpen) return null
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const bg_button = ['bg-primary-50', 'bg-primary-500']
  const text_color = ['text-red-600', 'text-green-600']

  return (
    <div
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
      onClick={handleOverlayClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className='bg-white rounded-lg shadow-lg p-6 w-full max-w-xl '
        onClick={e => e.stopPropagation()}
      >
      <div className='flex justify-between items-center pb-2 mb-4'>
            <div className='flex-col grid gap-1'>
              <h2 className='text-base font-bold'>
                {title}
              </h2>
              <h2 className='text-[#8C9CBD] text-xs font-normal'>
                {description}
              </h2>
            </div>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-800'
            >
              <X size={24} />
            </button>
          </div>
        <div className={`flex flex-col justify-center items-center`}>
          {children}
        </div>
        <div className='mt-4 flex justify-between'>
          {buttons &&
            buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`px-4 py-1  flex flex-row justify-center items-center h-12 rounded-2xl ${bg_button[index]}`}
              >
                <h3 className={` text-2xl ${buttons.length === 1 ? text_color[index + 1] : text_color[index]}`}>
                  {button.text}
                </h3>
              </button>
            ))}
        </div>
      </motion.div>
    </div>
  )
}
