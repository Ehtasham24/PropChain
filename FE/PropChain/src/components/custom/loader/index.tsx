interface LoaderProps {
  text: string;
}

export const LoaderComponent: React.FC<LoaderProps> = ({ text }) => {
  return (
    <>
      <span className='opacity-0'>{text}</span>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='flex space-x-2'>
          <div
            className='w-3 h-3 bg-blue-300 rounded-full animate-bounce'
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className='w-3 h-3 bg-blue-300 rounded-full animate-bounce'
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className='w-3 h-3 bg-blue-300 rounded-full animate-bounce'
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </>
  );
};
