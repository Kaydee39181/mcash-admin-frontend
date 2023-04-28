import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function AgentFeeInlineForm({
  fieldName,
  register,
  transactionsType,
  rangetype,
  handleInputRangeType,
  index,
  modifyIndex,
  setValue,
  watch,
  getIsFirstOccurrence,
  error
}) {
  const [minLimit, setMinLimit] = useState(0);
  const transactionId = watch(`${fieldName}.transactionTypeId`)
  const min = watch(`${fieldName}.min`)


  return (
    <tbody className="transaction-table-body" key={fieldName}>
      <td>
        <select
          ref={register({ required: true })}
          name={`${fieldName}.transactionTypeId`}
          
          onChange={async ({ target }) => {
            const maxRange = await handleInputRangeType(
              target.value,
              index.id,
              "transactionTypeId"
            );
            if (getIsFirstOccurrence(index, transactionId)) {
              setValue(`${fieldName}.min`, maxRange || 0)
            }
            setMinLimit(maxRange)
            modifyIndex(index, target.value);
          }}
        >
          <option value="">Select Transaction Type</option>
          {transactionsType.map((transType, i) => {
            return (
              <option key={i} value={transType.id}>
                {transType.type}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <input
          ref={register}
          type="text"
          disabled
          name={`${fieldName}.min`}
          onChange={(e) =>
            handleInputRangeType(e.target.value, index.id, "min")
          }
        />
      </td>
      <td>
        <input
          ref={register({
            required: true,
            pattern: {
              value: "^[0-9]*$",
              message: "invalid email address"
            },
            validate: (value) => Number(value) < Number(min) ? 'Max should be greater than min' : undefined
          })}
          type="number"
          
          value={rangetype[index.id].max}
          name={`${fieldName}.max`}
          onChange={({ target }) => {
            console.log(minLimit, target.value);
            if (minLimit < Number(target.value)) {
              handleInputRangeType(target.value, index.id, "max");
            }
          }}
        />
        {error ? error.max && <p className='errormessage'>{error.max.message}</p> : ''}
      </td>
      <td>
        <select ref={register({ required: true })} name={`${fieldName}.rangeType`} >
          <option value="">Select Range Type</option>
          <option value="p">Percentage</option>
          <option value="d">Flat-fee</option>
          <option value="h">Hybrid</option>
        </select>
      </td>
      <td>
        <input
          ref={register({ required: 'fee is required' })}
          value={rangetype[index.id].rangeType}
          type="number"
          name={`${fieldName}.fee`}
          onChange={(e) =>
            handleInputRangeType(e.target.value, index.id, "rangeType")
          }
          
        />
        {error ? error.rangeType && <p>{error.rangeType.message}</p> : ''}
      </td>
      <td>
        <input
          ref={register({ required: true })}
          value={rangetype[index.id].ambassadorCut}
          type="number"
          name={`${fieldName}.ambassadorCut`}
          onChange={(e) =>
            handleInputRangeType(e.target.value, index.id, "ambassadorCut")
          }
          
        />
      </td>
    </tbody>
  );
}

export default AgentFeeInlineForm;
