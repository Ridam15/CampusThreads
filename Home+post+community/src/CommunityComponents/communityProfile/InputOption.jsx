function InputOption({Icon, title, color}) {
    return (
      <div className='flex items-center text-[gray] cursor-pointer p-2.5 hover:bg-[whitesmoke] hover:rounded-[10px]'>
        <Icon style={{color: color}}/>
        <h4 className="ml-2.5 -mt-0.5 mb-0">{title}</h4>
      </div>
    )
  }
  
  export default InputOption
  