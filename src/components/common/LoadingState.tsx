interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Maʼlumotlar yuklanmoqda...' }: LoadingStateProps) {
  return (
    <div className="status-message" role="status">
      <span className="status-spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
