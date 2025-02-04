import { getSession, useSession } from 'next-auth/client';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import { PlusIcon, XIcon } from '@heroicons/react/solid';
import ReactPlayer from 'react-player/lazy';

function Show({ result }) {
   console.log(result);
   const [session] = useSession();
   const BASE_URL = 'https://image.tmdb.org/t/p/original/';
   const router = useRouter();
   const [showPlayer, setShowPlayer] = useState(false);

   useEffect(() => {
      if (!session) {
         router.push('/');
      }
   }, []);

   const index = result.videos.results.findIndex(
      (element) => element.type === 'Trailer',
   );

   return (
      <div className='relative'>
         <Head>
            <title>{result.title || result.original_name}</title>
            <link rel='icon' href='/favicon.ico' />
         </Head>
         <Header />
         {!session ? (
            <Hero />
         ) : (
            <section className='relative z-50'>
               <div className='relative min-h-[calc(100vh-72px)]'>
                  <Image
                     src={
                        `${BASE_URL}${
                           result.backdrop_path || result.poster_path
                        }` || `${BASE_URL}${result.poster_path}`
                     }
                     layout='fill'
                     objectFit='cover'
                  />
               </div>
               <div className='absolute z-50 space-y-6 inset-y-12 md:inset-y-auto md:bottom-10 inset-x-4 md:inset-x-12'>
                  <h1 className='text-3xl font-bold sm:text-4xl md:text-5xl'>
                     {result.title || result.original_name}
                  </h1>
                  <div className='flex items-center space-x-3 md:space-x-5'>
                     <button className='text-xs md:text-base bg-[#f9f9f9] text-black flex items-center justify-center py-2.5 px-6 rounded hover:bg-[#c6c6c6]'>
                        <img
                           src='/images/play-icon-black.svg'
                           alt=''
                           className='h-6 md:h-8'
                        />
                        <span className='font-medium tracking-wide uppercase'>
                           Play
                        </span>
                     </button>

                     <button
                        className='text-xs md:text-base bg-black/30 text-[#f9f9f9] border border-[#f9f9f9] flex items-center justify-center py-2.5 px-6 rounded hover:bg-[#c6c6c6]'
                        onClick={() => setShowPlayer(true)}
                     >
                        <img
                           src='/images/play-icon-white.svg'
                           alt=''
                           className='h-6 md:h-8'
                        />
                        <span className='font-medium tracking-wide uppercase'>
                           Trailer
                        </span>
                     </button>

                     <div className='flex items-center justify-center border-2 border-white rounded-full cursor-pointer w-11 h-11 bg-black/60'>
                        <PlusIcon className='h-6' />
                     </div>

                     <div className='flex items-center justify-center border-2 border-white rounded-full cursor-pointer w-11 h-11 bg-black/60'>
                        <img src='/images/group-icon.svg' alt='' />
                     </div>
                  </div>

                  <p className='text-xs md:text-sm'>
                     {result.release_date || result.first_air_date} •{' '}
                     {result.number_of_seasons}{' '}
                     {result.number_of_seasons === 1 ? 'Season' : 'Seasons'} •{' '}
                     {result.genres.map((genre) => genre.name + ' ')}{' '}
                  </p>
                  <h4 className='max-w-4xl text-sm md:text-lg'>
                     {result.overview}
                  </h4>
               </div>

               {/* Bg Overlay */}
               {showPlayer && (
                  <div className='absolute inset-0 z-50 w-full h-full bg-black opacity-50'></div>
               )}

               <div
                  className={`absolute top-3 inset-x-[7%] md:inset-x-[13%] rounded overflow-hidden transition duration-1000 ${
                     showPlayer ? 'opacity-100 z-50' : 'opacity-0'
                  }`}
               >
                  <div className='flex items-center justify-between bg-black text-[#f9f9f9] p-3.5'>
                     <span className='font-semibold'>Play Trailer</span>
                     <div
                        className='cursor-pointer w-8 h-8 flex justify-center items-center rounded-lg opacity-50 hover:opacity-75 hover:bg-[#0F0F0F]'
                        onClick={() => setShowPlayer(false)}
                     >
                        <XIcon className='h-5' />
                     </div>
                  </div>
                  <div className='relative pt-[56.25%]'>
                     <ReactPlayer
                        url={`https://www.youtube.com/watch?v=${result.videos?.results[index]?.key}`}
                        width='100%'
                        height='100%'
                        style={{ position: 'absolute', top: '0', left: '0' }}
                        controls={true}
                        playing={showPlayer}
                     />
                  </div>
               </div>
            </section>
         )}
      </div>
   );
}

export default Show;

export async function getServerSideProps(context) {
   const session = await getSession(context);
   const { id } = context.query;

   const request = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=videos`,
   ).then((response) => response.json());

   return {
      props: {
         session,
         result: request,
      },
   };
}
