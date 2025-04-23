const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')
const container = require('../../container')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')

describe('/comments endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    describe('when POST /comments', () => {
        it('should response 201 and persisted comments', async () => {
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

            const requestPayloadThread = {
                title: 'thread title',
                body: 'thread body',
            }

            const responseThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const responseThreadJson = JSON.parse(responseThread.payload)
            const requestPayload = {
                content: 'a content'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedComment).toBeDefined()
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

            const requestPayloadThread = {
                title: 'thread title',
                body: 'thread body',
            }

            const responseThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const responseThreadJson = JSON.parse(responseThread.payload)
            const requestPayload = {}

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada')
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

            const requestPayloadThread = {
                title: 'thread title',
                body: 'thread body',
            }

            const responseThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const responseThreadJson = JSON.parse(responseThread.payload)
            const requestPayload = {
                content: 123
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai')
        })

        it('should response 404 when request params not found', async () => {
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

            const requestPayloadThread = {
                title: 'thread title',
                body: 'thread body',
            }

            const responseThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            const requestPayload = {
                content: 'a content'
            }

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/xxx/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('thread tidak ditemukan')
        })
    })
})