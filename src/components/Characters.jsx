import { Flex, Image, SimpleGrid, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useParams } from 'react-router-dom'
import { useMobileDevice } from '../hooks/useMobileDevice'
import useFetcher from '../hooks/useFetcher'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CharactersLoading from './loading/Characters'
import CarouselLoading from './loading/CarouselLoading'
import MyCarousel from './Carousel'

export default function Characters({ loading }) {
  const mobile = useMobileDevice()
  const { id } = useParams()

  const { data, isLoading, isError } = useFetcher(`https://api.jikan.moe/v4/anime/${id}/characters`, ['characters', id])

  if (isError) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Text>Something went wrong when fetching List Characters</Text>
      </div>
    )
  }

  return (
    <>
      {isLoading || loading ? (
        mobile ? (
          <CarouselLoading gap={0} slideSize='70'>
            <Skeleton height={108.88} width={70} count={2} />
          </CarouselLoading>
        ) : (
          Array(10)
            .fill()
            .map((_, index) => <CharactersLoading key={index} bg={index % 2 == 0 ? 'white' : '#f8f8f8'} />)
        )
      ) : mobile ? (
        <MyCarousel drag slideGap='1px' withControls={false} slideSize='70'>
          {data?.map((item, index) => {
            if (item.voice_actors[0]) {
              return (
                <Carousel.Slide key={index}>
                  <Flex>
                    <Image h={108.88} width={70} src={item.character.images.webp.image_url} alt={item.name} />
                    <Text
                      c='white'
                      fz={8}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        fontWeight: 400,
                        padding: '0px 5px',
                        background: `linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(255,255,255,0) 100%)`,
                      }}>
                      {Number(item.favorites).toLocaleString()} users
                    </Text>
                    <Text
                      fz={8}
                      truncate
                      c='white'
                      style={{
                        width: '100%',
                        top: 78,
                        fontWeight: 400,
                        padding: '15px 5px 5px',
                        position: 'absolute',
                        background: `linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(255,255,255,0) 100%)`,
                      }}>
                      {item.character.name}
                    </Text>
                  </Flex>
                  <Flex>
                    <Image w={70} src={item.voice_actors[0]?.person.images.jpg.image_url} alt={item.name} />
                    <Text
                      truncate
                      fz={8}
                      c='white'
                      style={{
                        width: '100%',
                        fontWeight: 400,
                        padding: '15px 5px 5px',
                        bottom: 0,
                        position: 'absolute',
                        background: `linear-gradient(0deg, rgba(0,0,0,1) 30%, rgba(255,255,255,0) 100%)`,
                      }}>
                      {item.voice_actors[0]?.person.name}
                    </Text>
                  </Flex>
                </Carousel.Slide>
              )
            }
          })}
        </MyCarousel>
      ) : (
        <>
          <Flex style={{ borderStyle: 'solid', borderWidth: '0 0 1px' }} p={3} justify='space-between'>
            <Text>Characters</Text>
            <Text>Voice Actors</Text>
          </Flex>
          {data.map((item, index) => (
            <SimpleGrid cols={2} key={index} p={'5px 0'} bg={index % 2 == 0 ? 'white' : '#f8f8f8'}>
              <Flex>
                <Image height={200} width={120} src={item.character.images.webp.image_url} alt={item.name} />
                <div style={{ marginLeft: '10px' }}>
                  <Text fz={14}>{item.character.name}</Text>
                  <Text fz={14}>{item.role}</Text>
                  <Text fz={14}>{Number(item.favorites).toLocaleString()} Favorites</Text>
                </div>
              </Flex>
              <div style={{ marginLeft: 'auto' }}>
                {item.voice_actors.map((item, index) => {
                  return (
                    <Flex key={index} ta='right' ml={'auto'} justify={'right'}>
                      <div style={{ padding: '0 4px' }}>
                        <Text fz={12}>{item.person.name}</Text>
                        <Text fz={12}>{item.language}</Text>
                      </div>
                      <a href={item.person.url} target='_blank'>
                        <Image width={42} height={62} src={item.person.images.jpg.image_url} />
                      </a>
                    </Flex>
                  )
                })}
              </div>
            </SimpleGrid>
          ))}
        </>
      )}
    </>
  )
}
