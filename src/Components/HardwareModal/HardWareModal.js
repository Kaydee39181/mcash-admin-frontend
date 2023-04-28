import React, { useRef, useState } from "react";
import "./HardwareModal.css";
import axios from "axios";
import HardWareLoader from "./HardWareLoader";
import { Alert } from "react-bootstrap";

const HardWareModal = ({ close }) => {
	const uploadRef = useRef(null);
	const [file, setFile] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isSuccessfull, setIsSuccessfull] = useState(false);
	const [isFailed, setIsFailed] = useState(false);

	const _handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("file", file);
		setLoading(true);
		axios
			.post(
				"https://cashout.mcashpoint.com/hardware/load",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then((res) => {
				setLoading(false);
				setIsSuccessfull(true);
				// console.log(res);
				setTimeout(() => {
					close();
				}, 2000);
			})
			.catch((err) => {
				// console.log(err);
				setLoading(false);
				setIsFailed(true);
				setTimeout(() => {
					setIsFailed(false);
				}, 2000);
			});
	};

	return (
		<div className="hwm-overlay">
			<form onSubmit={_handleSubmit} className="hwm-content">
				<span onClick={close} className="hwm-close">
					&times;
				</span>

				{isSuccessfull && (
					<Alert variant="success">{"File Uploaded Successfully"}</Alert>
				)}

				{isFailed && (
					<Alert variant="danger">{"Error! Please try again"}</Alert>
				)}
				<h6 className="hwm-header">Upload CSV File</h6>

				<div className="hwm-file-section">
					<p
						onClick={() => {
							uploadRef.current.click();
						}}
						className="hwm-caption"
					>
						Choose File
					</p>
					<input
						ref={uploadRef}
						onChange={(e) => {
							const _file = e.target?.files[0] ? e.target.files[0] : null;
							setFile(_file);

							if (_file && _file.name.split(".")[1] === "csv") {
								setError(false);
							} else {
								setError(true);
							}
						}}
						className="hwm-file"
						type="file"
					/>
				</div>
				{error && <p className="hwm-fileName2">Please upload a CSV file</p>}
				<p className="hwm-fileName">{file ? file.name : "No file chosen"}</p>

				<div className="hwm-flex">
					{!loading ? (
						<button
							disabled={
								file && file.name.split(".")[1] === "csv" ? false : true
							}
							className={`hwm-upload-button ${
								file && file.name.split(".")[1] === "csv" ? "" : "hwm-no-cursor"
							}`}
						>
							Upload
						</button>
					) : (
						<HardWareLoader />
					)}
				</div>
			</form>
		</div>
	);
};

export default HardWareModal;
