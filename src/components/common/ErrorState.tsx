interface ErrorStateProps {
  message: string
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="status-message status-message--error" role="alert">
      {message}
    </div>
  )
}
