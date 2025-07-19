import axios, { type AxiosError } from "axios"
import { SMS_API_KEY } from "../configs/env.cofig"

const sendSms = async (phoneNumber: string, message: string): Promise<boolean> => {
  const apiUrl = `https://samayasms.com.np/smsapi/index?key=${SMS_API_KEY}&contacts=${phoneNumber}&senderid=FSN_Alert&msg= ${message}&responsetype=json` // Replace with the correct endpoint

  try {
    const response = await axios.get(apiUrl)
    if (response.data.response_code === 200 && response.data.response_message === "success") {
      // console.log('SMS Sent ', response.data);
      return true
    }

    // console.log('Sending SMS Failed: ', response.data);
    return false
  } catch (error: AxiosError | any) {
    // console.error(`Failed to send OTP: ${error.message}`);
    return false
  }
}

export default sendSms
