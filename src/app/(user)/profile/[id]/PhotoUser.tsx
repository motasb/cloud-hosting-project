"use client";

import { CldImage } from 'next-cloudinary'
import React from 'react'

interface PhotoUserProps{
    photoId:string;
}

const PhotoUser = ({photoId}:PhotoUserProps) => {
  return (
    <CldImage
    src={photoId}
    alt="Profile Picture"
    width={120}
    height={120}
    className="rounded-full border-4 border-gray-300"
    priority
  />
  )
}

export default PhotoUser