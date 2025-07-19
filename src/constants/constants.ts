export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  BUYER: "buyer",
  SELLER: "seller",
}); 

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const GENDER = Object.freeze({
  MALE: "male",
  FEMALE: "female",
  OTHERS: "others"
})

export type Gender = (typeof GENDER)[keyof typeof GENDER]