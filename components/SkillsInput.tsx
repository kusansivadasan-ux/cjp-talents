'use client'

import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface SkillsInputProps {
  value: string[]
  onChange: (skills: string[]) => void
}

export function SkillsInput({ value, onChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('')

  function addSkill(skill: string) {
    const trimmed = skill.trim()
    if (trimmed && !value.includes(trimmed) && value.length < 10) {
      onChange([...value, trimmed])
    }
    setInputValue('')
  }

  function removeSkill(skill: string) {
    onChange(value.filter((s) => s !== skill))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(inputValue)
    }
    if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeSkill(value[value.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addSkill(inputValue)}
        placeholder="Type a skill and press Enter (e.g. React, Design, Sales)"
        className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] placeholder:text-white/30"
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-[#E8540A]/10 text-[#E8540A] border border-[#E8540A]/20 pl-3 pr-2 py-1 gap-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
