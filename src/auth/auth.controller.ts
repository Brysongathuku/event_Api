import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import {
  createCustomerService,
  verifyCustomerService,
  customerLoginService,
  // getCustomerWithBookingsAndPaymentsService,
  // getAllCustomersWithBookingsAndPaymentsService,
  getCustomerService,
  getCustomerByIdService,
  getCustomerByEmailService,
  updateCustomerService,
  deleteCustomerService,
} from "./auth.service";
import jwt from "jsonwebtoken";
import { sendEmail } from "../mailer/mailer";
import { TSCustomerLoginInput } from "../Drizzle/schema";

// create user controller
export const registerCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const customer = req.body;
    const password = customer.password;
    const hashedPassword = await bcrypt.hashSync(password, 10);
    customer.password = hashedPassword;

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    customer.verificationCode = verificationCode;
    customer.isVerified = false;

    const createUser = await createCustomerService(customer);
    if (!createUser) return res.json({ message: "User not created" });

    try {
      await sendEmail(
        customer.email,
        "Verify your account",
        `Hello ${customer.firstName} ${customer.lastName}, your verification code is: ${verificationCode}`,
        `<div>
                <h2>Hello ${customer.firstName} ${customer.lastName},</h2>
                <p>Your verification code is: <strong>${verificationCode}</strong></p>
                 <p>Enter this code to verify your account.</p>
                </div>`
      );
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError);
    }
    return res
      .status(201)
      .json({ message: "User created. Verification code sent to email." });

    // const createCustomer = await createCustomerService(customer);
    // if (!createCustomer) return res.json({ message: "Customer not created" })
    // return res.status(201).json({ message: createCustomer });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyCustomerController = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  try {
    const customer = await getCustomerByEmailService(email);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (String(customer.verificationCode) === String(code)) {
      await verifyCustomerService(email);

      try {
        await sendEmail(
          customer.email,
          "Account Verified Successfully",
          `Hello ${customer.firstName} ${customer.lastName}, your account has been verified. You can now log in and use all features.`,
          `<div>
            <h2>Hello ${customer.firstName} ${customer.lastName},</h2>
            <p>Your account has been <strong>successfully verified</strong>!</p>
            <p>You can now log in and enjoy our services.</p>
          </div>`
        );
      } catch (error: any) {
        console.error("Failed to send verification success email:", error);
      }

      return res.status(200).json({ message: "User verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const loginCustomerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as TSCustomerLoginInput; //ensures TypeScript knows that req.body *should* have email and password.

    if (!email || typeof email !== "string" || email.trim() === "") {
      return res
        .status(400)
        .json({ message: "Email is required and must be a non-empty string." });
    }
    if (!password || typeof password !== "string" || password.length === 0) {
      return res.status(400).json({
        message: "Password is required and must be a non-empty string.",
      });
    }

    const customerExist = await getCustomerByEmailService(email);

    if (!customerExist) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userMatch = await bcrypt.compare(
      password,
      customerExist.password as string
    );

    if (!userMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //Generate JWT Token
    const secret = process.env.JWT_SECRET as string;

    // Essential: Check if JWT_SECRET is defined
    if (!secret) {
      console.error(
        "Critical Error: JWT_SECRET environment variable is not defined!"
      );
      return res.status(500).json({
        message: "Server configuration error. Please try again later.",
      });
    }

    // Create the JWT payload
    const payload = {
      sub: customerExist.customerID,
      user_id: customerExist.customerID,
      first_name: customerExist.firstName,
      last_name: customerExist.lastName,
      role: customerExist.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3, // 3 days expiration in seconds
    };
    //  generate  the token
    const token = jwt.sign(payload, secret);

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        // Return necessary user info, but NEVER the password
        user_id: customerExist.customerID,
        first_name: customerExist.firstName,
        last_name: customerExist.lastName,
        email: customerExist.email,
        role: customerExist.role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "An unexpected error occurred during login." });
  }
};

// export const getCustomerBookingsAndPaymentsController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const id = parseInt(req.params.id);
//     if (isNaN(id)) {
//       return res.status(400).json({ message: "Invalid customer ID provided." });
//     }

//     const customerData = await getCustomerWithBookingsAndPaymentsService(id);

//     if (!customerData) {
//       return res.status(404).json({ message: "Customer not found." });
//     }

//     return res.status(200).json({ data: customerData });
//   } catch (error: any) {
//     console.error(
//       "Error fetching customer with bookings and payments by ID:",
//       error
//     );
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const getAllCustomersBookingsAndPaymentsController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const customersData = await getAllCustomersWithBookingsAndPaymentsService();

//     if (!customersData || customersData.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No customers with bookings and payments found." });
//     }

//     return res.status(200).json({ data: customersData });
//   } catch (error: any) {
//     console.error(
//       "Error fetching all customers with bookings and payments:",
//       error
//     );
//     return res.status(500).json({ error: error.message });
//   }
// };
// get all customer controller
export const getCustomerController = async (req: Request, res: Response) => {
  try {
    const customers = await getCustomerService();
    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }
    return res.status(200).json({ data: customers });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// get customer by id controller
export const getCustomerByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const customer = await getCustomerByIdService(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json(customer);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// update customer by id controller
export const updateCustomerController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const customer = req.body;

    // Convert dueDate to a Date object if provided
    if (customer.dueDate) {
      customer.dueDate = new Date(customer.dueDate);
    }

    const existingCustomer = await getCustomerByIdService(id);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updatedCustomer = await updateCustomerService(id, customer);
    if (!updatedCustomer) {
      return res.status(400).json({ message: "Customer not updated" });
    }
    return res.status(200).json({ message: "Customer updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// delete customer by id controller

export const deleteCustomerController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const existingCustomer = await getCustomerByIdService(id);
    if (!existingCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const deleted = await deleteCustomerService(id);
    if (!deleted) {
      return res.status(400).json({ message: "Customer not deleted" });
    }

    return res.status(204).json({ message: "Customer deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
