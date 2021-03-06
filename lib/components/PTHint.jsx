import React, { useState, cloneElement } from 'react'
import classnames from 'classnames'
import { useTooltip, TooltipPopup } from '@reach/tooltip'

import { QuestionMarkCircle } from 'lib/components/QuestionMarkCircle'

export const PTHint = (props) => {
  const { children, className, title } = props
  let { tip } = props

  const [trigger, tooltip] = useTooltip()

  const [isVisible, setIsVisible] = useState(false)

  const show = (e) => {
    setIsVisible(true)
  }

  const hide = (e) => {
    setIsVisible(false)
  }

  const toggleVisible = (e) => {
    setIsVisible(!isVisible)
  }

  if (title) {
    tip = <>
      <div
        className='-mx-8 bg-highlight-5 px-8 py-4 -mt-6 rounded-t-lg'
      >
        <h5
          className='text-green'
        >
          {title}
        </h5>
      </div>

      <div
        className='pt-4'
      >
        {tip}
      </div>
    </>
  }

  return <>
    <div
      className={classnames(
        className,
        'relative cursor-pointer',
      )}
    >
      <div
        {...trigger}
        onMouseEnter={show}
        onMouseOut={hide}
        onTouchStart={toggleVisible}
        className={classnames(
          'cursor-pointer h-full w-full l-0 r-0 t-0 b-0 absolute',
        )}
        style={{
          zIndex: 12314082
        }}
      />

      {children ? children : <QuestionMarkCircle />}
    </div>

  
    <TooltipPopup
      {...tooltip}
      isVisible={isVisible}
      label={tip}
    />
  </>
}
