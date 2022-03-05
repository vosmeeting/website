import classNames from 'classnames'
type ITitle = React.FC<React.HTMLProps<HTMLHeadingElement>>
type IParagraph = React.FC<React.HTMLProps<HTMLParagraphElement>>
export const Title: ITitle = ({ children, className, ...props }) => {
  return (
    <h1
      className={classNames(
        'font-serif text-4xl sm:text-6xl text-vosm-blue mb-2',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export const P: IParagraph = (props) => {
  return <p className="text-slate-700" {...props} />
}
