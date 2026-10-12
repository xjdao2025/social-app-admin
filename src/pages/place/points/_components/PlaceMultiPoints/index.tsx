import NodeGrantForm from '../NodeGrantForm'

export default function PlaceMultiPoints({ reload }: { reload: () => void }) {
  return <NodeGrantForm reload={reload} multiple />
}
