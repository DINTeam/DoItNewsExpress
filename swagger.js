
'use strict';

module.exports = {
    swaggerDefinition: {
        openapi : "3.0.0", //우리가 사용하고 있는 Open Api 버전
        // Api에 필요한 정보를 다룸(선택필드)
        info: {
            title: 'Express Service with Swagger', //Api 제목
            version: '1.0.0', //api 버전
            description: 'a Rest api using swagger and express.' //api 상세정보
        },
        // 주소
        host: "localhost:3000/api-docs",
        // 기본 root path
        basePath: "/",
        contact: {
            email: "doitnews@gmail.com"
        },
        // 각 api에서 설명을 기록할 때 사용할 constant들을 미리 등록해놓는것
        components: {
            res: {
                BadRequest: {
                    description: '잘못된 요청.',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                },
                Forbidden: {
                    description: '권한이 없슴.',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                },
                NotFound: {
                    description: '없는 리소스 요청.',
                    schema: {
                        $ref: '#/components/errorResult/Error'
                    }
                }
            },
            errorResult: {
                Error: {
                    type: 'object',
                    properties: {
                        errMsg: {
                            type: 'string',
                            description: '에러 메시지 전달.'
                        }
                    }
                }
            }
        },
        schemes: ["http", "https"], // 가능한 통신 방식
        definitions:  // 모델 정의 (User 모델에서 사용되는 속성 정의)
            {
                'User': {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        age: {
                            type: 'integer'
                        },
                        addr: {
                            type: 'string'
                        }
                    }
                }
            }
    },
    apis: ['./routes/*.js'] // api 파일 위치들
};