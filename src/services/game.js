import { getRandomInt } from '../util/helpers'
import axios from 'axios'

const BASE_URL = 'http://jservice.io/api';
const NUMBER_OF_CATEGORIES = 6;
const NUMBER_OF_QUESTIONS_PER_CATEGORY = 5;
const POINTS = [200, 400, 600, 800, 1000];

export default class Game {
    constructor() {
        this.maxCategories = null;
        this.categoryIDs = [];
        this.categories = [];
        this.questions = [];
    }

    getAndSetMaxCategories = async () => {
        if (this.maxCategories) {
            return this.maxCategories;
        }
        
        // Get max number of categories
        try {
            const categoryRes = await axios.get(`${BASE_URL}/categories`);
            this.maxCategories = categoryRes.data[0].id;
            return this.maxCategories;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    
    fetchAndSetCategories = async () => {
        let fetchedCategories = 0;
        while (fetchedCategories < NUMBER_OF_CATEGORIES) {
            const finalCategory = {};
            try {
                const categoryRes = await this.getCategories();
                if (categoryRes) {
                    const { id } = categoryRes.data;
                    this.categoryIDs.push(id);
                    finalCategory.id = id;
                    finalCategory.name = categoryRes.data.title;
                    this.categories.push(finalCategory)
                    fetchedCategories++;
                }
            } catch (e) {
                console.log(e);
                break;
            }
        }
    }

    getRandomCategory = () => {
        const randomCategory = getRandomInt(this.maxCategories);
        if (!this.categoryIDs.includes(randomCategory)) {
            return randomCategory;
        } else {
            this.getRandomCategory(this.maxCategories);
        }
    }

    getCategories = async () => {
        // Get random category
        const categoryID = this.getRandomCategory(this.maxCategories);
        try {
            const categoryRes = await axios.get(`${BASE_URL}/category?id=${categoryID}`);
            if (categoryRes.data.clues_count >= NUMBER_OF_QUESTIONS_PER_CATEGORY) {
                const questions = this.getQuestionsFromCategory(categoryRes.data.clues);
                if (questions.length === NUMBER_OF_QUESTIONS_PER_CATEGORY) {
                    this.questions.push(questions);
                    return categoryRes;
                }
            }
            return false;
        } catch (e) {
            console.log(e);
            throw(e);
        }
    }


    getQuestionsFromCategory = arr => {
        const questions = [];

        POINTS.forEach(point => {
            const question = arr.find(q => {
                if (q.value === point && q.invalid_count === null) {
                    return true;
                } else {
                    return false;
                }
            })

            if (question) {
                questions.push(question)
            }
        })
        return questions;
    }
}