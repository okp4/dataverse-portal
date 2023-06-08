import { Card } from '@/ui/component/card/card'
import { Skeleton } from '@/ui/component/skeleton/skeleton'
import './loadingDataverseCards.scss'

export const loadingDataverseCards = (quantity: number): JSX.Element[] =>
  [...Array(quantity)].map((_, i) => (
    <Card key={i}>
      <div className="okp4-dataverse-portal-card-loader-container">
        <Skeleton height={30} variant="text" width={80} />
        <div className="okp4-dataverse-portal-card-loader-text-wrapper">
          <Skeleton height={25} variant="text" width={'84%'} />
          <Skeleton height={25} variant="text" width={'84%'} />
        </div>
        <Skeleton height={40} variant="rounded" width={150} />
      </div>
    </Card>
  ))
