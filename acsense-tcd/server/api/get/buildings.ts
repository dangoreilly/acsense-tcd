

export default defineEventHandler((event) => {

    let route = useRoute()

    return {
      query: route.query
    }
  })