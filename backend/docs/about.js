import dotenv from "dotenv";
dotenv.config();

/**
 * @swagger
 * components:
 *  schemas:
 *    About:
 *      type: object
 *      required:
 *        - content
 *      properties:
 *        id:
 *          type: INT
 *          description: The increment id of the about
 *        content:
 *          type: TEXT
 *          description: The name of the about
 *        createdAt:
 *          type: DATETIME
 *          description: About creation time
 *        updatedAt:
 *          type: DATETIME
 *          description: About update time
 *      example:
 *        content: Test about
 */

/**
 * @swagger
 * abouts:
 *  name: About
 *  description: The abouts managing API
 */

/**
 * @swagger
 * /about:
 *    get:
 *        summary: Returns the lastest about information
 *        tags: [About]
 *        responses:
 *          200:
 *            description: The lists of the Abouts
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/About"
 *          400:
 *            description: Request query has error
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/About"
 *          500:
 *            description: Unknow error happen
 */

/**
 * @swagger
 * /about:
 *    post:
 *        summary: Create a new about
 *        tags: [About]
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/About"
 *        responses:
 *          200:
 *            description: The about was successfully created
 *            content:
 *              application/json:
 *                schema:
 *                    $ref: "#/components/schemas/About"
 *          400:
 *            description: Some query property is wrong
 *          401:
 *            description: Unauthorized
 *          422:
 *            description: Some query property is missing
 *          500:
 *            description: Unknow error happen
 */