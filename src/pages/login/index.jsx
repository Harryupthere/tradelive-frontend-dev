import React from 'react'
import './login.scss'
import { LoginContent, commonLabel } from '../../../constants/content'
import { Facebook, Google, Instagram, TechLineButton } from '../../../icon/icons'
import { Link } from 'react-router-dom'
import { PasswordInput, TextInput } from '../../../components/formFields'
import useLoginUtils from './useLoginUtils';
const Login = () => {
    const { handleSubmit, onSubmit, control, loading, } = useLoginUtils();
    return (
        <>
            <div className='login-wrapper'>
                <div className='login-content'>
                    <div className='login-header'>
                        <h3>{LoginContent?.title}</h3>
                        <p>{LoginContent?.welcome}</p>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextInput control={control} name="email" placeholder="Enter Your Email ID" />
                        <PasswordInput control={control} name="password" placeholder="Enter Your Password" />
                        <div className='btn-shape-common'>
                            <button type='submit' className="common-btn login-btn">
                                {commonLabel?.loginBtn}
                                <div className='tech-one'>
                                    <TechLineButton />
                                </div>
                                <div className='tech-two'>
                                    <TechLineButton />
                                </div>
                            </button>
                        </div>
                        <Link to={'/forgotpassword'} className="forgot-password">{LoginContent?.forgot}</Link>
                        <p>or</p>
                        <div className='social-media-wrapper'>
                            <Link><Facebook /></Link>
                            <Link><Google /></Link>
                            <Link><Instagram /></Link>
                        </div>
                        <h6>{LoginContent?.recommend}</h6>
                        <h5>{commonLabel?.dontHaveAccount}</h5>
                        <div className='btn-shape-common grey-shape'>
                            <Link to={'/language'} className="common-btn create-account-btn">
                                {commonLabel?.createAccount}
                                <div className='tech-one'>
                                    <TechLineButton />
                                </div>
                                <div className='tech-two'>
                                    <TechLineButton />
                                </div>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login