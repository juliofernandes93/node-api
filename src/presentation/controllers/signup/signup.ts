import {HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount} from './signup-protocols'
import {MissingParamError, InvalidParamError, ServerError} from '../../errors/index'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller{
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor (emailValidator: EmailValidator, addAccount: AddAccount){
        this.emailValidator = emailValidator
        this.addAccount = addAccount
    }
    handle (httpRequest: HttpRequest): HttpResponse{
        try{
            const requiredFields = ['name', 'email', 'passworda', 'passwordaConfirmation']
            for (const field of requiredFields){
                if(!httpRequest.body[field]){
                    return badRequest(new MissingParamError(field))
                }
            }
            const {name, email, password, passwordConfirmation} = httpRequest.body
            if (password !== passwordConfirmation){
                return badRequest (new InvalidParamError('passwordConfirmation'))
            }
            const isValid = this.emailValidator.isValid(email)
            if (!isValid){
                return badRequest(new InvalidParamError('email'))
            }
            this.addAccount.add({
                name,
                email,
                password
            })
        } catch (error){
            return serverError()
        }
    }

}