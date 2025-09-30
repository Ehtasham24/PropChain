//import mainLogo from '../../../../public/assets/images/Final logo 2 FortensiaAi-02 1.svg';
import Image from 'next/image';
import propertyLogo from '../../../../public/assets/images/prop.jpeg';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayOutComponent: React.FC<AuthLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <main className='flex flex-row min-h-screen'>
        <div
          className='lg:flex justify-center items-center w-[60%] h-screen text-secondary text-center hidden'
          style={{
            background:
              'linear-gradient(90deg, #DEECFE 0%, #B0D4F1 31%, #7FB6E9 68%, #5097E1 100%)',
          }}
        >
          <h1 className='text-[60px] text-black opacity-75 font-bold'>
            Prop Chain
          </h1>
        </div>

        <div className='flex flex-col w-full lg:w-[40%] p-6'>
          <div className='flex flex-col w-full h-full items-center justify-center p-8'>
            <div className='w-full max-w-[620px]'>{children}</div>
          </div>
        </div>
      </main>
    </>
  );
};
