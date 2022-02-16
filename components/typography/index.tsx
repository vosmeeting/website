import classNames from 'classnames'
type ITitle = React.FC<React.HTMLProps<HTMLHeadingElement>>
type IParagraph = React.FC<React.HTMLProps<HTMLParagraphElement>>
export const Title: ITitle = ({ children, className, ...props }) => {
  return (
    <h1
      className={classNames('font-serif text-6xl text-vosm-blue', className)}
      {...props}
    >
      {children}
    </h1>
  )
}

export const P: IParagraph = (props) => {
  return <p className="text-slate-700" {...props} />
}
