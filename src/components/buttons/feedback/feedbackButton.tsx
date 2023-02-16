import Image from 'next/image'
import type { FC } from 'react'
import feedbackIcon from '../../../../public/icons/feedback.svg'
import './feedbackButton.scss'

export const FeedbackButton: FC = () => (
  <button className="okp4-dataverse-portal-feedback-button-main">
    <div className="okp4-dataverse-portal-feedback-button-content-container">
      <Image alt="feeback-button-icon" src={feedbackIcon} />
      <p>give us feedback</p>
    </div>
  </button>
)
