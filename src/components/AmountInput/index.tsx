import React from 'react'
import styled from 'styled-components'
import { BridgeTitle, CheckListType } from '../../pages/bridge/transfer'
import { useTranslation } from 'react-i18next'
import { Input } from 'antd'
import { CenterRow } from '../Row/index'
import { Currency, PairInfo } from '../../state/bridge/reducer'
import BN from 'bignumber.js'
import { getPairInfo, getDecimals } from '../../utils/index'
import { useWeb3React } from '@web3-react/core'
import { debounce } from 'lodash'

export interface AmountInputProps {
  amount: string
  setAmount: any
  currency: Currency
  totalSupply: string
  checkList: CheckListType
  setCheckList: any
  available: string
  pairId: number
  swapFee: string
  supplyLoading: boolean
  availabelLoading: boolean
  swapFeeLoading: boolean
}

const AmountInputWrap = styled.div`
  margin-top: 16px;
  width: 100%;
  .ant-input {
    background-color: #f5f5f6;
    height: 38px;
  }
`

export const TextWrap = styled(CenterRow)`
  align-items: center;
  justify-content: space-between;
`

const SuffixText = styled.span`
  font-family: URWDIN-Regular;
  height: 16px;
  font-weight: 400;
  color: rgba(1, 8, 30, 0.38);
  font-size: 16px;
`

export const ErrorText = styled.span`
  font-family: URWDIN-Regular;
  color: #f00;
  font-size: 12px;
`
export enum TransferType {
  'NATIVE',
  'TOKEN',
}

const AmountInput: React.FunctionComponent<AmountInputProps> = ({
  currency,
  amount,
  setAmount,
  checkList,
  setCheckList,
  totalSupply,
  available,
  pairId,
  swapFee,
  supplyLoading,
  availabelLoading,
  swapFeeLoading,
}) => {
  const { t, i18n } = useTranslation()
  const { account, chainId, library } = useWeb3React()
  const [errorInfo, setErrorInfo] = React.useState<string>('Invalid number')

  const pairInfo = React.useMemo(() => {
    return getPairInfo(pairId)
  }, [pairId])

  /* get info from chain */
  const maxLimit = new BN(pairInfo?.max as any).toNumber() === 0 ? false : true

  // the the min decimals between two chains
  const decimalsLimit = React.useMemo(() => {
    if (!pairInfo) return
    return pairInfo?.srcChainInfo.decimals > pairInfo?.dstChainInfo.decimals
      ? pairInfo?.dstChainInfo.decimals
      : pairInfo?.srcChainInfo.decimals
  }, [pairId, pairInfo])

  const setErrorInfoPrehandle = (key: string): string => {
    switch (key) {
      case 'errorFormatText':
        return t(`Invalid number`)
      case 'decimalErrorText':
        return t(`The decimal point cannot exceed`)
      case 'insufficientText':
        return t(`Insufficient available balance`)
      case 'insufficientFeeText':
        return t(`Insufficient transfer fee`)
      case 'minAmountText':
        return t(`The minimum exchange quantity is`) + ' ' + new BN(pairInfo?.min ?? 0).toNumber().toString()
      case 'insufficienBridgeText':
        return t(`Input amount is bigger than bridge available balance`)
      case 'lessThanFeeText':
        return t(`Input amount should bigger than transfer fee`)
      default:
        return t('Invalid amount')
    }
  }

  const updateAddressStatus = (status: boolean, text?: string) => {
    setCheckList((list: any) => {
      return { ...list, amount: status }
    })
    text && setErrorInfo(() => text)
  }

  const hasSufficientSwapFee = () => {
    if (!account || !pairInfo) return false
    console.log('swapfee', swapFee)
    console.log('available', available)
    // native check
    if (pairInfo.srcChainInfo.tag === 0) {
      if (new BN(swapFee).gte(available)) {
        return false
      }
    }
    // token check
    if (new BN(swapFee).gt(available)) {
      return false
    }
    return true
  }

  const transferFeeToDistFee = (pair: PairInfo) => {
    if (pair.srcChainInfo.decimals === pair.dstChainInfo.decimals) {
      return swapFee
    } else {
      // pair token decimal is not equal
      return new BN(swapFee)
        .div(Math.pow(10, pair.srcChainInfo.decimals))
        .multipliedBy(Math.pow(10, pair.dstChainInfo.decimals))
        .toString()
    }
  }

  const checkAmountOverflow = (inputAmount: string, input: string, pair: PairInfo) => {
    // check swapFee
    if (!hasSufficientSwapFee()) {
      updateAddressStatus(false, setErrorInfoPrehandle('insufficientFeeText'))
      return
    }

    // check native
    if (pair.srcChainInfo.tag === 0) {
      // available > input + fee
      if (new BN(inputAmount).plus(swapFee).gt(available)) {
        updateAddressStatus(false, setErrorInfoPrehandle('insufficientText'))
        return
      }

      // input > fee
      if (new BN(inputAmount).lte(swapFee)) {
        updateAddressStatus(false, setErrorInfoPrehandle('lessThanFeeText'))
        return
      }
    }

    // check token availble
    if (pair.srcChainInfo.tag === 1) {
      if (new BN(inputAmount).gt(available)) {
        updateAddressStatus(false, setErrorInfoPrehandle('insufficientText'))
        return
      }
    }

    // check supply
    if (pair.limitStatus) {
      if (new BN(input).multipliedBy(Math.pow(10, pair.dstChainInfo.decimals)).gt(totalSupply)) {
        updateAddressStatus(false, setErrorInfoPrehandle('insufficienBridgeText'))
        return
      }
    }

    // check min
    if (new BN(input).lt(new BN(pair.min as any))) {
      updateAddressStatus(false, setErrorInfoPrehandle('minAmountText'))
      return
    }

    // check max
    if (maxLimit && new BN(input).gt(new BN(pair.max as any))) {
      updateAddressStatus(false, setErrorInfoPrehandle('maxAmountText'))
      return
    }

    updateAddressStatus(true, '')
  }

  const changeAmount = (e: any) => {
    if (!pairInfo?.srcChainInfo) return

    const input = typeof e === 'string' ? e : e.target.value.trim()
    const numberAmount = new BN(input).multipliedBy(Math.pow(10, pairInfo?.srcChainInfo.decimals)).toNumber()
    const inputAmount = new BN(input).multipliedBy(Math.pow(10, pairInfo?.srcChainInfo.decimals)).toString()

    const decimal = getDecimals(input)

    // init true
    updateAddressStatus(true)

    if (!account) {
      // no check
      updateAddressStatus(true)
    } else if (input[0] === '.' || numberAmount <= 0) {
      // invalid number format
      updateAddressStatus(false, setErrorInfoPrehandle('errorFormatText'))
    } else if (decimalsLimit && decimal > decimalsLimit) {
      // invalid decimal
      updateAddressStatus(false, setErrorInfoPrehandle('decimalErrorText') + decimalsLimit)
    } else {
      checkAmountOverflow(inputAmount, input, pairInfo)
    }

    setAmount(() => input)
  }

  React.useEffect(() => {
    if (!swapFeeLoading && !supplyLoading && !swapFeeLoading) {
      changeAmount(String(amount))
    }
  }, [
    pairInfo,
    i18n.language,
    pairId,
    available,
    swapFee,
    totalSupply,
    swapFeeLoading,
    availabelLoading,
    supplyLoading,
  ])

  return (
    <AmountInputWrap>
      <TextWrap>
        <BridgeTitle>{t(`Amount`)}</BridgeTitle>
        {!checkList.amount && account && !swapFeeLoading && !supplyLoading && !availabelLoading ? (
          <ErrorText> * {errorInfo}</ErrorText>
        ) : null}
      </TextWrap>
      <Input
        value={amount}
        maxLength={8}
        type="number"
        onChange={changeAmount}
        style={{ background: '#F5F5F6' }}
        suffix={<SuffixText>{currency.symbol.toUpperCase()}</SuffixText>}
      />
    </AmountInputWrap>
  )
}

export default React.memo(AmountInput)
