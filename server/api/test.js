export default defineEventHandler((event) => {

const { name } = getQuery(event)

    return{
        message: `Hello test world ${name}`
    }
})