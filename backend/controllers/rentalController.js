const Rental = require("../schema/rental");
const Student = require("../schema/student");
const Book = require("../schema/book");

const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate({
        path: 'student',
        model: 'Student',
      }).populate({
        path : 'book',
        model : 'Book',
      })
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: "3 Internal server error" });
  }
};

const getRentalsByStudentIsbn = async (req, res) => {
  const { isbn } = req.params;
  try {
    // Find the student based on the roll number
    const student = await Student.findOne({ isbn });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find rentals where the student field matches the student's ID
    const rentals = await Rental.find({ student: student._id }) .populate({
      path: 'book',
      model: 'Book', // Name of the Student model
    });

    if (!rentals || rentals.length === 0) {
      return res.status(404).json({ message: "No rentals found for this student" });
    }

    res.status(200).json(rentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ message: "2 Internal server error" });
  }
};

const rentBook = async (req, res) => {
  const { bookId, studentId,rentalDate,returnDate } = req.body;
  try {
    const rental = new Rental({
      book: bookId,
      student: studentId,
      rentalDate,
      returnDate
    });
    await rental.save();
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: "1 Internal server error" });
  }
};

const returnBook = async(req,res)=> {
  const {isbn} = req.params;
  const { bookId } = req.body;
  try {
    const student = await Student.findOne({isbn});
    const deletedRental = await Rental.findOneAndDelete({book : bookId, student : student._id});
    if(!deletedRental){
      console.log("No rental");
    }
    res.status(201).json({message : "Book returned"})
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllRentals,
  rentBook,
  getRentalsByStudentIsbn,
  returnBook,
};
