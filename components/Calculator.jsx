import React, { useRef } from "react"
import { useForm } from "react-hook-form"

import Input from "./Input"

const Calculator = () => {
  const defaultResult = "--"

  const { register, formState, handleSubmit, setError } = useForm()
  const { errors, isSubmitting } = formState

  const dayResultRef = useRef()
  const monthResultRef = useRef()
  const yearResultRef = useRef()

  const resetResult = () => {
    yearResultRef.current.innerText = defaultResult
    monthResultRef.current.innerText = defaultResult
    dayResultRef.current.innerText = defaultResult
  }

  const invalidDate = (year, month, day) => {
    const inputDate = new Date(year, month, day)

    if (
      !(
        inputDate.getFullYear() == year &&
        inputDate.getMonth() == month &&
        inputDate.getDate() == day
      )
    ) {
      setError("day", {
        type: "invalidDate",
        message: "Must be a valid date",
      })
      setError("month", {
        type: "invalidDate",
        message: "",
      })
      setError("year", {
        type: "invalidDate",
        message: "",
      })

      return true
    }

    // Is a valid date
    return false
  }

  const calculateAge = (start, end) => {
    const startYear = start.getFullYear()
    const startMonth = start.getMonth()
    const startDateOfMonth = start.getDate()

    const endYear = end.getFullYear()
    const endMonth = end.getMonth()
    const endDateOfMonth = end.getDate()

    let years = endYear - startYear
    let months = endMonth - startMonth
    let days = endDateOfMonth - startDateOfMonth

    if (months < 0 || (months === 0 && days < 0)) {
      years--
      months += 12
    }

    if (days < 0) {
      const lastMonthEndDate = new Date(endYear, endMonth, 0)
      const lastMonthDays = lastMonthEndDate.getDate()
      days = lastMonthDays - startDateOfMonth + endDateOfMonth
      months--
    }

    return {
      years: years,
      months: months,
      days: days,
    }
  }

  const countUp = (element, target, duration) => {
    return new Promise((resolve) => {
      let count = 0
      const interval = Math.ceil(duration / target)

      const countInterval = setInterval(() => {
        count++
        element.current.innerText = count

        if (count >= target) {
          clearInterval(countInterval)
          resolve()
        }
      }, interval)
    })
  }

  const calculateAgeHandler = async (formValues) => {
    // Clear previous results
    resetResult()

    // Parse values to integer
    const year = formValues.year
    const month = formValues.month - 1
    const day = formValues.day

    // Cancel form submission if inputs equal an invalid date
    if (invalidDate(year, month, day)) {
      return
    }

    // Calculate age
    const inputDate = new Date(year, month, day)
    const currentDate = new Date()
    const results = calculateAge(inputDate, currentDate)

    // Display results
    try {
      await countUp(yearResultRef, results.years, 1000)
      await countUp(monthResultRef, results.months, 200)
      await countUp(dayResultRef, results.days, 400)
    } catch (error) {
      console.error("CountUp Error:", error)
    }
  }

  const moveFocus = (e, nextElement, charLimit) => {
    const value = e.target.value

    if (value.length === charLimit) {
      document.getElementById(nextElement).focus()
    }
  }

  const dayValidationRules = {
    required: "This field is required",
    validate: {
      outsideDayRange: (value) => {
        return !(value < 1 || value > 31) || "Must be a valid day"
      },
    },
  }

  const monthValidationRules = {
    required: "This field is required",
    validate: {
      outsideMonthRange: (value) => {
        return !(value < 1 || value > 12) || "Must be a valid month"
      },
    },
  }

  const yearValidationRules = {
    required: "This field is required",
    validate: {
      outsideYearRange: (value) => {
        const currentYear = new Date().getFullYear()
        return !(value > currentYear) || "Must be in the past"
      },
    },
  }

  return (
    <div className="bg-white xl:min-h-[650px] xl:min-w-[840px] min-h-[485px] min-[400px]:min-w-[345px] min-[400px]:mx-0 mx-4 rounded-xl rounded-br-[5rem] shadow-sm">
      <div className="xl:pt-14 pt-12 pb-9 xl:pl-14 min-[400px]:pl-[1.5rem] pl-4 min-[400px]:pr-0 pr-4 max-w-[300px]">
        <div className="max-w-[300px]">
          <div className="flex xl:gap-8 min-[400px]:gap-4 gap-2 w-full">
            <Input
              placeholder="DD"
              name="day"
              errors={errors}
              register={register}
              moveToNextFocus={(e) => {
                moveFocus(e, "month", 2)
              }}
              validation={dayValidationRules}
            />

            <Input
              placeholder="MM"
              name="month"
              errors={errors}
              register={register}
              moveToNextFocus={(e) => {
                moveFocus(e, "year", 2)
              }}
              validation={monthValidationRules}
            />

            <Input
              placeholder="YYYY"
              name="year"
              errors={errors}
              register={register}
              moveToNextFocus={(e) => {
                moveFocus(e, "btnCalculateAge", 4)
              }}
              validation={yearValidationRules}
            />
          </div>

          <div className="xl:mr-10 min-[400px]:mr-6 mr-5 xl:pt-12 pt-16 relative border-b border-b-gray-200 xl:min-w-[725px] min-[400px]:min-w-[310px] min-w-[265px]">
            <button
              id="btnCalculateAge"
              aria-label="CalculateAge"
              className="flex items-center justify-center bg-soft-purple xl:h-[92px] h-[65px] xl:w-[92px] w-[65px] rounded-full absolute xl:right-0 min-[400px]:right-[120px] right-[6rem] xl:top-[3px] top-8 hover:bg-black transition-all shadow-md outline-none"
              disabled={isSubmitting}
              onClick={handleSubmit(calculateAgeHandler)}>
              <img src="./icon-arrow.svg" alt="Arrow" className="xl:w-14 w-9" />
            </button>
          </div>
        </div>
      </div>

      <div className="xl:pt-6 min-[400px]:pt-2 pt-0 min-[400px]:ml-14 ml-10 min-[400px]:mr-[3.75rem] mr-10 xl:mt-3 min-[400px]:mt-10 mt-8 max-w-[700px]">
        <p className="xl:text-[100px] min-[400px]:text-[56px] text-[40px] font-extrabold italic xl:pl-10 pl-1 xl:-m-10 min-[400px]:-m-8 -m-2 xl:max-w-[720px] max-w-[310px]">
          <span ref={yearResultRef} className="text-soft-purple">
            --
          </span>{" "}
          years
        </p>
        <p className="xl:text-[100px] min-[400px]:text-[56px] text-[40px] font-extrabold italic xl:pl-10 pl-1 xl:-m-10 min-[400px]:-m-8 -m-2 xl:max-w-[720px] max-w-[310px]">
          <span ref={monthResultRef} className="text-soft-purple">
            --
          </span>{" "}
          months
        </p>
        <p className="xl:text-[100px] min-[400px]:text-[56px] text-[40px] font-extrabold italic xl:pl-10 pl-1 xl:-m-10 min-[400px]:-m-8 -m-2 xl:max-w-[720px] max-w-[310px]">
          <span ref={dayResultRef} className="text-soft-purple">
            --
          </span>{" "}
          days
        </p>
      </div>
    </div>
  )
}

export default Calculator
