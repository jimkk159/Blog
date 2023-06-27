import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  schemas:
 *    Post:
 *      type: object
 *      required:
 *        - content
 *      properties:
 *        id:
 *          type: INT
 *          description: The increment id of the post
 *        previewImg:
 *          type: VARCHAR(255)
 *          description: The previewImg of the post
 *        summary:
 *          type: TEXT
 *          description: The summary of the post
 *        content:
 *          type: TEXT
 *          description: The content of the post
 *        thumbs:
 *          type: INT
 *          description: The thumbs of the post
 *        views:
 *          type: INT
 *          description: The views of the post
 *        CategoryId:
 *          type: INT
 *          description: The id of category this post belongs to. The foreign key of to Category
 *        Category:
 *          type: Object
 *          description: The populated category information from CategoryId
 *        AuthorId:
 *          type: INT
 *          description: The id of author this post belongs to. The foreign key of to User
 *        Author:
 *          type: Object
 *          description: The populated author information from AuthorId
 *        Comments:
 *          type: Array of Object
 *          description: The populated comments information from CommentId
 *        Tags:
 *          type: Array of Object
 *          description: The populated tag information from TagIds
 *        editedAt:
 *          type: DATETIME
 *          description: Post last edited time
 *        createdAt:
 *          type: DATETIME
 *          description: Post creation time
 *        updatedAt:
 *          type: DATETIME
 *          description: Post update time
 *      example:
 *        previewImg: "https://previewImg.jpg"
 *        summary: 1234
 *        title: Test title
 *        content: Test content
 *        thumbs: 1
 *        views: 1
 *        editedAt: 2023-06-24T10:02:53.000Z
 *        CategoryId: 7
 *        Category: []
 *        AuthorId: 3
 *        Author: []
 *        Comments: []
 *        Tags: []
 */

/**
 * @swagger
 * tags:
 *  name: Post
 *  description: The posts managing API
 */

/**
 * @swagger
 * /posts:
 *    get:
 *        summary: Returns the lists of the posts
 *        tags: [Post]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-content
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the posts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/{id}:
 *    get:
 *        summary: Get the posts by id
 *        tags: [Post]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: This is the post id
 *        responses:
 *          200:
 *            description: The post by id
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Post"
 *          404:
 *            description: The post was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts:
 *    post:
 *        summary: Create a new post
 *        tags: [Post]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *            schema:
 *                example:
 *                   CategoryId: 4
 *                   title: test title
 *                   content: test content
 *                   summary: test summary
 *                   previewImg: https://previewImg.com
 *                   tagsId: [1, 2]
 *        responses:
 *          200:
 *            description: The post was successfully created
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Some query property is wrong
 *          401:
 *            description: Unauthorized
 *          422:
 *            description: Some query property is missing
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/{id}:
 *    patch:
 *        summary: Update the post by id
 *        tags: [Post]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The post id
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Post"
 *        responses:
 *          200:
 *            description: The post was updated
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Post"
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The post was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/{id}:
 *    delete:
 *        summary: Remove the post by id
 *        tags: [Post]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The post id
 *        responses:
 *          204:
 *            description: The post was deleted successfully.
 *          401:
 *            description: Unauthorized
 *          403:
 *            description: The user does not have permission to access
 *          404:
 *            description: The post was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/{id}/thumb:
 *    patch:
 *        summary: Increase the thumb of the post
 *        tags: [Post]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The post id
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Post"
 *        responses:
 *          200:
 *            description: The thumb of the post was increased
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Post"
 *          401:
 *            description: Unauthorized
 *          404:
 *            description: The post was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/{id}/category/{category_id}":
 *    patch:
 *        summary: update the cateogry of the post
 *        tags: [Post]
 *        parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The post id
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Post"
 *        responses:
 *          200:
 *            description: Updated category of Post successfully!
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/Post"
 *          401:
 *            description: Unauthorized
 *          404:
 *            description: The post was not found
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/me:
 *    get:
 *        summary: Returns the lists of my posts
 *        tags: [Post]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-content
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the posts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Request query has error
 *          401:
 *            description: Unauthorized
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/search:
 *    get:
 *        summary: Returns the lists of search posts
 *        tags: [Post]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-content
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the posts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/views:
 *    get:
 *        summary: Returns the lists of posts order by views
 *        tags: [Post]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-content
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the posts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/thumbs:
 *    get:
 *        summary: Returns the lists of posts order by thumbs
 *        tags: [Post]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-content
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the posts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/comments:
 *    get:
 *        summary: Returns the lists of posts order by thumbs
 *        tags: [Post]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-content
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the posts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /posts/home:
 *    get:
 *        summary: Special for the home page to get the ranking of the post, it will get the top 5 comments, top 10 thumbs and top 10 views post back
 *        tags: [Post]
 *        parameters:
 *          - in: query
 *            name: range
 *            schema:
 *              type: string
 *            description: Allow response the traget range of data, support operator are 「gt」:greater than, 「gte」:greater than and equal, 「lt」:less than, 「lte」:less than and equal. e.g.:id[gt]=5
 *          - in: query
 *            name: fields
 *            schema:
 *              type: string
 *            description: Add or remove the fields of response. e.g.fields=-content
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string
 *            description: Sort the response data by target field, default is sorted by edited time from new to old.
 *          - in: query
 *            name: limit
 *            schema:
 *              type: string
 *            description: The number of response data, default value is 15
 *          - in: query
 *            name: page
 *            schema:
 *              type: string
 *            description: Combined with limit query, to the target page of limited data, the default value is 1
 *          - in: query
 *            name: all
 *            schema:
 *              type: string
 *            description: To get all the data back, ignore the paginate, default is 0. e.g. all=1
 *          - in: query
 *            name: pop
 *            schema:
 *              type: string
 *            description: Populate the data from foreign key on the target fields. e.g.pop=AuthorId
 *        responses:
 *          200:
 *            description: The lists of the posts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Post"
 *          400:
 *            description: Request query has error
 *          500:
 *            description: Unknow error happen
 */