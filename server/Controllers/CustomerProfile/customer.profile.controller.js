const Customer = require("../../Models/Auth/Users/customer.model");
const User = require("../../Models/Auth/user.model");






const getProfile = async (req, res) => {
  try {
    const user = req.user;
    console.log("Fetching profile for user:", user.id);

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can view this profile.",
      });
    }

    // Check if customer profile exists
    let customer = await Customer.findOne({ userId: user.id }).populate(
      "bookings.packageId travelHistory.packageId"
    );


    console.log("Customer : "  , customer);
    console.log("User : " , user);

    // If no customer profile exists, create one with default values
    if (!customer) {
      customer = await Customer.create({
        userId: user.id,
        passport: {
          passportNumber: 'TEMP-' + Math.random().toString(36).substring(2, 10),
          countryOfIssue: 'TBD',
          dateOfIssue: new Date(),
          dateOfExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
          isVerified: false
        }
        
      });
      
      // Update user with customerRef
      await User.findByIdAndUpdate(user.id, { customerRef: customer._id });
    }
    
    const uu = await User.findById(user.id);
    console.log("----------------------------------")
    console.log("Updated User : " , uu);
    console.log("----------------------------------")

    const profileData = {
      user: {
        firstName: uu.firstName,
        lastName: uu.lastName,
        email: uu.email,
        phone: uu.phone,
        alternatePhone: uu.alternatePhone,
        dateOfBirth: uu.dateOfBirth,

      },
      customer: {
        address: customer.address || {},
        passport: customer.passport || {},
        nationality: customer.nationality || '',
        preferredDestinations: customer.preferredDestinations || [],
        travelHistory: customer.travelHistory || [],
        inquiries: customer.inquiries || [],
        bookings: customer.bookings || [],
        notes: customer.notes || [],
      },
    };

    res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile.",
      error: error.message
    });
  }
};







const saveProfile = async (req, res) => {
  try {
    const user = req.user;
    console.log("called=====================================")
    console.log(req.body)

    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can update this profile.",
      });
    }

    const {
      firstName,
      lastName,
      phone,
      alternatePhone,
      dateOfBirth,
      address,
      passport,
      nationality,
      preferredDestinations,
    } = req.body;

    

    // Update user data
    const userUpdates = {};
    if (firstName) userUpdates.firstName = firstName;
    if (lastName) userUpdates.lastName = lastName;
    if (phone) userUpdates.phone = phone;
    if (alternatePhone) userUpdates.alternatePhone = alternatePhone;
    if (dateOfBirth) userUpdates.dateOfBirth = dateOfBirth;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(user._id, userUpdates, { new: true });
    }

    // Check if customer profile exists, create if not
    let customer = await Customer.findOne({ userId: user.id });
    if (!customer) {
      customer = await Customer.create({
        userId: user.id,
        passport: {
          passportNumber: passport?.passportNumber || 'TEMP-' + Math.random().toString(36).substring(2, 10),
          countryOfIssue: passport?.countryOfIssue || 'TBD',
          dateOfIssue: passport?.dateOfIssue || new Date(),
          dateOfExpiry: passport?.dateOfExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
          isVerified: false
        }
      });
      await User.findByIdAndUpdate(user.id, { customerRef: customer._id });
    }

    // Prepare update data
    const updateData = {};
    
    if (address) updateData.address = address;
    if (nationality) updateData.nationality = nationality;
    if (preferredDestinations) updateData.preferredDestinations = preferredDestinations;
    
    if (passport) {
      console.log("Called Updated");
      updateData.passport = {
        passportNumber: passport.passportNumber || customer.passport?.passportNumber || 'TEMP-' + Math.random().toString(36).substring(2, 10),
        countryOfIssue: passport.countryOfIssue || customer.passport?.countryOfIssue || 'TBD',
        dateOfIssue: passport.dateOfIssue || customer.passport?.dateOfIssue || new Date(),
        dateOfExpiry: passport.dateOfExpiry || customer.passport?.dateOfExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
        placeOfIssue: passport.placeOfIssue || customer.passport?.placeOfIssue || '',
        nationality: passport.nationality || customer.passport?.nationality || '',
        documentImage: passport.documentImage || customer.passport?.documentImage || '',
        isVerified: passport.isVerified || customer.passport?.isVerified || false,
      };
    }

    // Update customer data
    const updatedCustomer = await Customer.findOneAndUpdate(
      { userId: user.id },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: {
        user: userUpdates,
        customer: updatedCustomer
      },
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving profile.",
      error: error.message
    });
  }
};






const clearProfile = async (req, res) => {
  try {
    const user = req.user;
    console.log("Clearing profile for user:", user.id);
    if (user.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only customers can clear this profile.",
      });
    }

    const clearedCustomer = await Customer.findOneAndUpdate(
      { userId: user._id },
      {
        $set: {
          address: {},
          passport: {
            passportNumber: "TEMP-" + Math.random().toString(36).substring(2, 10),
            countryOfIssue: "TBD",
            dateOfIssue: new Date(),
            dateOfExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
            placeOfIssue: "",
            nationality: "",
            documentImage: "",
            isVerified: false,
          },
          nationality: "",
          preferredDestinations: [],
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile data cleared successfully",
      data: clearedCustomer,
    });
  } catch (error) {
    console.error("Error clearing profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while clearing profile.",
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  saveProfile,
  clearProfile,
};