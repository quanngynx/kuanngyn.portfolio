import { z } from 'zod'

export const contactFormSchema = z.object({
  fullName: z.string().min(1, 'Tên đầy đủ là bắt buộc'),
  mail: z.email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc'),
  message: z.string().min(1, 'Nội dung tin nhắn là bắt buộc'),
}) 