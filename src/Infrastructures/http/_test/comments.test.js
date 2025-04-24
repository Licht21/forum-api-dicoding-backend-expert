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

    describe('when POST /thread/{threadId}/comments', () => {
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

            await server.inject({
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

    describe('when DELETE /thread/{threadId}/comments/{commentId}', () => {
        it('should response 404 when comment not found', async () => {
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


            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments/xxx`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('comment tidak ditemukan')
        })

        it('should reponse 403 when not owner comment delete a comment', async () => {
            // Arrange
            const requestPayloadAuthenticationsUser1 = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayloadAuthenticationsUser2 = {
                username: 'dicodingIndonesia',
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

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                  username: 'dicodingIndonesia',
                  password: 'secret',
                  fullname: 'Dicoding Indonesia',
                },
            });
        
            const responseTokensUser1 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayloadAuthenticationsUser1,
            });

            const responseTokensUser2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayloadAuthenticationsUser2,
            });

            const responseTokensJsonUser1 = JSON.parse(responseTokensUser1.payload)
            const accessTokenUser1  = responseTokensJsonUser1.data.accessToken

            const responseTokensJsonUser2 = JSON.parse(responseTokensUser2.payload)
            const accessTokenUser2  = responseTokensJsonUser2.data.accessToken

            const requestPayloadThread = {
                title: 'thread title',
                body: 'thread body',
            }

            const responseThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
                headers: {
                    Authorization: `Bearer ${accessTokenUser1}`
                }
            })
            const responseThreadJson = JSON.parse(responseThread.payload)

            const requestPayloadComment = {
                content: 'a content'
            }

            const responseComment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
                payload: requestPayloadComment,
                headers: {
                    Authorization: `Bearer ${accessTokenUser1}`
                }
            })
            const responseCommentJson = JSON.parse(responseComment.payload)


            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
                headers: {
                    Authorization: `Bearer ${accessTokenUser2}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('User tidak memiliki akses ke comment berikut')
        })

        it('should response 200 when delete comment success', async () => {
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

            const requestPayloadComment = {
                content: 'a content'
            }

            const responseComment = await server.inject({
                method: 'POST',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments`,
                payload: requestPayloadComment,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const responseCommentJson = JSON.parse(responseComment.payload)


            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${responseThreadJson.data.addedThread.id}/comments/${responseCommentJson.data.addedComment.id}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            // Assert
            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })
    })
})