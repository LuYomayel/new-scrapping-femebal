'use client'

import { FaTwitter, FaInstagram } from 'react-icons/fa'

export function FooterComponent() {
  return (
    <footer className="mt-5 py-4 text-center">
      <p className="mb-2">Esta página fue creada por Luciano Yomayel</p>
      <div className="flex justify-center space-x-4">
        <a
          href="https://twitter.com/LuYomayel"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-blue-500 transition-colors"
        >
          <FaTwitter className="mr-2" />
          @LuYomayel
        </a>
        <a
          href="https://www.instagram.com/LuYomayel"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-pink-500 transition-colors"
        >
          <FaInstagram className="mr-2" />
          @LuYomayel
        </a>
      </div>
    </footer>
  )
}