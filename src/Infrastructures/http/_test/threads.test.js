const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const container = require('../../container')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayloadAuthentications = {
                username: 'dicoding',
                password: 'secret',
            };
            
            const server = await createServer(container);
            
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                  username: 'dicoding',
                  password: 'secret',
                  fullname: 'Dicoding Indonesia',
                },
            });
        
            const responseTokens = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayloadAuthentications,
            });

            const responseTokensJson = JSON.parse(responseTokens.payload)
            const accessToken  = responseTokensJson.data.accessToken

            const requestPayload = {
                title: 'thread title',
                body: 'thread body',
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedThread).toBeDefined()
        })

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayloadAuthentications = {
                username: 'dicoding',
                password: 'secret',
            };
            
            const server = await createServer(container);
            
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                  username: 'dicoding',
                  password: 'secret',
                  fullname: 'Dicoding Indonesia',
                },
            });
        
            const responseTokens = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayloadAuthentications,
            });

            const responseTokensJson = JSON.parse(responseTokens.payload)
            const accessToken  = responseTokensJson.data.accessToken

            const requestPayload = {
                title: 'thread title'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayloadAuthentications = {
                username: 'dicoding',
                password: 'secret',
            };
            
            const server = await createServer(container);
            
            // add user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                  username: 'dicoding',
                  password: 'secret',
                  fullname: 'Dicoding Indonesia',
                },
            });
        
            const responseTokens = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayloadAuthentications,
            });

            const responseTokensJson = JSON.parse(responseTokens.payload)
            const accessToken  = responseTokensJson.data.accessToken

            const requestPayload = {
                title: 'thread title',
                body: 123
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
        })
    })
})