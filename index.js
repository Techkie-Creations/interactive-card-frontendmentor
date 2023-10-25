let animate = () => {
	let num = document.querySelector(".num");
	num.innerHTML = num.textContent.replace(
		/\S/g,
		"<span class='letter' style='display: inline-block'>$&</span>"
	);
	let tl = gsap.timeline({ delay: 1, ease: "none", delay: 0 });
	tl.to(".front", {
		rotateY: "360deg",
		ease: "bounce",
		duration: 3,
		scale: 1.3,
	})
		.from(".logo", { opacity: 0, y: "-300%", ease: "bounce" })
		.from(".num .letter", { stagger: 0.2, opacity: 0, y: "-300%" })
		.from(".id span", { stagger: 0.2, ease: "elastic", opacity: 0 })
		.to(".front", { rotateY: 0, ease: "bounce", scale: 1, duration: 3 })
		.from(".back", {
			rotation: 360,
			ease: "bounce",
			opacity: 0,
			x: "-300%",
			duration: 2,
		})
		.from(".back p", { scale: 2, fontWeight: "bold", duration: 2 })
		.from(".thanks .item", {
			stagger: 0.3,
			duration: 1.5,
			opacity: 0,
			y: "-300%",
		})
		.to(".thanks a", { scale: 1.05, repeat: -1, duration: 2 });
};

let App = () => {
	React.useEffect(() => {
		$("#cc-number").payment("formatCardNumber");
		$("#cvc").payment("formatCardCVC");
		$("#mm").payment("formatCardCVC");
		$("#yy").payment("formatCardCVC");
	}, []);

	const [state, setState] = React.useState({
		cardholder: "",
		cardnum: "",
		mm: "",
		yy: "",
		cvc: "",
	});

	const [errName, setErrorName] = React.useState(["", "random"]);
	const [errNum, setErrorNum] = React.useState(["", "random"]);
	const [errCvc, setErrorCvc] = React.useState(["", "random"]);
	const [errYear, setErrorYear] = React.useState("random");
	const [errMonth, setErrorMonth] = React.useState("random");
	const [errDate, setErrorDate] = React.useState(["", ""]);
	const [display, setDisplay] = React.useState("");

	let count = 0;

	let handleChange = (event) => {
		setState({
			...state,
			[event.target.name]: event.target.value,
		});
	};

	let handleSubmit = (e) => {
		e.preventDefault();
		let year = new Date().getFullYear();
		let begin = /^[a-zA-Z\s]{3,}$/;
		if (!begin.test(state.cardholder)) {
			setErrorName([
				"Card Name Needs More Than 3 Letters Containing Letters And Spaces",
				"invalid",
			]);
		} else {
			setErrorName(["Looks Good", "valid"]);
			count++;
		}
		if (
			state.cardnum.split(" ").join("").length < 16 ||
			state.cardnum.split(" ").join("").length > 16
		) {
			setErrorNum(["There Must Be 16 Digits", "invalid"]);
		} else {
			setErrorNum(["Looks Good", "valid"]);
			count++;
		}

		if (
			Number(state.mm) > 12 &&
			Number(state.yy) <= Number(year.toString().substr(-2))
		) {
			setErrorMonth("invalid");
			setErrorYear("invalid");
			setErrorDate(["Invalid Expiry Date", "invalid"]);
		} else if (
			Number(state.mm) > 12 &&
			Number(state.yy) > Number(year.toString().substr(-2))
		) {
			setErrorMonth("invalid");
			setErrorYear("valid");
			setErrorDate(["Invalid Month: 1 - 12", "invalid"]);
		} else if (
			Number(state.mm) <= 12 &&
			Number(state.yy) <= Number(year.toString().substr(-2))
		) {
			setErrorYear("invalid");
			setErrorMonth("valid");
			setErrorDate(["Invalid Year: Must Be In The Future", "invalid"]);
		} else {
			setErrorMonth("valid");
			setErrorYear("valid");
			setErrorDate(["Looks Good", "valid"]);
			count += 2;
		}

		if (state.cvc.length < 3) {
			setErrorCvc(["Must Be At Least 3 Digits", "invalid"]);
		} else {
			setErrorCvc(["Looks Good", "valid"]);
			count++;
		}
		if (count === 5) {
			setTimeout(() => {
				setDisplay("none");
				animate();
			}, 300);
		}
		console.log(count, "COUNT");
	};

	return (
		<div className="card-con">
			<div className="cards">
				<div className="front">
					<img src="./images/card-logo.svg" alt="card logo" className="logo" />
					<h3 className="num">
						{state.cardnum.length >= 1 ? state.cardnum : "0000 0000 0000 0000"}
					</h3>
					<p className="id">
						<span>
							{state.cardholder.length >= 1
								? state.cardholder
								: "Jane Appleseed"}
						</span>
						<span>
							{state.mm.length >= 1 ? state.mm.padStart(2, "0") : "00"}/
							{state.yy.length >= 1 ? state.yy.padStart(2, "0") : "00"}
						</span>
					</p>
				</div>
				<div className="back">
					<p>{state.cvc.length >= 1 ? state.cvc.padStart(3, "0") : "123"}</p>
				</div>
			</div>
			<div className={`card-input ${display == "none" ? "none" : ""}`}>
				<form onSubmit={handleSubmit}>
					<div className="random">
						<label htmlFor="validationServer01">Cardholder Name</label>
						<input
							onChange={handleChange}
							type="text"
							className={`form-control is-${
								errName[1].length ? errName[1] : "random"
							}`}
							name="cardholder"
							value={state.cardholder}
							id="validationServer01"
							placeholder="e.g. Jane Appleseed"
							autoComplete="off"
							required
						/>
						<div className={`${errName[1]}-feedback`}>{errName[0]}</div>
					</div>
					<div className="random">
						<label htmlFor="validationServer01">card number</label>
						<input
							onChange={handleChange}
							type="text"
							className={`form-control is-${
								errNum[1].length ? errNum[1] : "random"
							}`}
							name="cardnum"
							value={state.cardnum}
							id="cc-number"
							placeholder="e.g. 1234 5678 9123 0000"
							maxLength="20"
							required
						/>
						<div className={`${errNum[1]}-feedback`}>{errNum[0]}</div>
					</div>
					<div className="date-cvc">
						<div className="date">
							<label htmlFor="validationServer01">Exp. Date (MM/YY)</label>
							<div className="month-year">
								<input
									onChange={handleChange}
									type="text"
									className={`form-control is-${
										errMonth.length ? errMonth : "random"
									}`}
									name="mm"
									value={state.mm}
									id="mm"
									maxLength="2"
									placeholder="MM"
									required
								/>
								<input
									onChange={handleChange}
									type="text"
									className={`form-control is-${
										errYear.length ? errYear : "random"
									}`}
									name="yy"
									value={state.yy}
									id="yy"
									maxLength="2"
									placeholder="YY"
									required
								/>
							</div>
							<div className={`${errDate[1]}-feedback`}>{errDate[0]}</div>
						</div>
						<div className="cvc">
							<label htmlFor="validationServer01">CVC</label>
							<input
								onChange={handleChange}
								type="text"
								className={`form-control is-${
									errCvc[1].length ? errCvc[1] : "random"
								}`}
								name="cvc"
								value={state.cvc}
								id="cvc"
								placeholder="e.g. 123"
								maxLength="4"
								required
							/>
							<div className={`${errCvc[1]}-feedback`}>{errCvc[0]}</div>
						</div>
					</div>
					<button type="submit" className="btn btn-primary">
						Confirm
					</button>
				</form>
			</div>
			<div className={`thanks ${display == "none" ? "" : "none"}`}>
				<img
					src="./images/icon-complete.svg"
					aria-hidden="true"
					className="item"
				/>
				<h1 className="item">Thank You!</h1>
				<p className="item">We've added your card details</p>
				<a href="/" className="item">
					<button className="btn btn-primary">Continue</button>
				</a>
			</div>
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById("target"));
